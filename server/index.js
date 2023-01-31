const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const socket = require("socket.io");
const http = require("http");
const cors = require("cors");

const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// mongodb
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://minseok-oh:minseok1942@mafiagame.37anbor.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

// routing
const server = http.createServer(app);
const io = socket(server);
const { User } = require("./models/User");

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.post("/", (req, res) => {
  console.log(req.body.name);
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userInfo,
    });
  });
});

let users = {
  name: [],
  isDead: [],
  isMafia: [],
};
let selected = [];
let result = 0;

io.sockets.on("connection", (socket) => {
  socket.on("init", (data) => {
    users.name.push(data.name);
    users.isDead.push(false);
    users.isMafia.push(false);

    io.sockets.emit("users", {
      name: users.name,
    });
  });

  socket.on("send", (data) => {
    let randomIndexArray = [];
    console.log(data.mafia);
    for (let i = 0; i < data.mafia; i++) {
      randomNum = Math.floor(Math.random() * users.name.length);
      if (randomIndexArray.indexOf(randomNum) === -1) {
        randomIndexArray.push(randomNum);
        users.isMafia[randomNum] = true;
      } else i--;
    }
    console.log(randomIndexArray);

    selected = [];
    for (let i = 0; i < users.name.length; i++) selected.push(0);

    io.sockets.emit("update", {
      start: true,
      day: data.day,
      night: data.night,
      name: users.name,
      isDead: users.isDead,
      isMafia: users.isMafia,
    });
  });

  socket.on("select", (data) => {
    console.log(data);
    if (data.isDay) {
      if (data.selected != -1) selected[Number(data.selected)] += 1;
      else result++;
    } else {
      if (data.isMafia) selected[Number(data.selected)] += 1;
      else result++;
    }
    console.log(selected);

    let surviveCount = 0;
    for (let i = 0; i < users.name.length; i++) {
      if (!users.isDead[i]) surviveCount++;
    }

    const temp = selected.reduce((sum, currValue) => sum + currValue, 0);
    console.log(surviveCount, temp + result);
    if (surviveCount === temp + result) {
      let maxId = 0;
      for (let j = 0; j < users.name.length; j++) {
        if (selected[maxId] < selected[j]) maxId = j;
      }

      if (selected[maxId] != 0) {
        io.sockets.emit("selected", {
          selected: maxId,
        });
        console.log(maxId);
        users.isDead[maxId] = true;
      }
      for (let i = 0; i < users.name.length; i++) selected[i] = 0;
      result = 0;
    }
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

server.listen(port, () => {
  console.log("Server!");
});
