import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import Panel from "../contents/Panel";

const Ready = () => {
  const [dayTime, setDayTime] = useState(0);
  const [nightTime, setNightTime] = useState(0);
  const [mafiaCount, setMafiaCount] = useState(0);
  const [gamerList, setGamerList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const dayTimeHandler = (data) => {
    setDayTime(data.target.value);
  };
  const nightTimeHandler = (data) => {
    setNightTime(data.target.value);
  };
  const mafiaCountHandler = (data) => {
    setMafiaCount(data.target.value);
  };
  const startButtonHandler = () => {
    send();
  };

  const socket = io();
  useEffect(() => {
    socket.emit("init", { name: location.state.name });
  }, []);
  socket.on("update", (data) => {
    if (data.start) {
      navigate(`/game/${location.state.name}`, {
        state: {
          name: location.state.name,
          day: data.day,
          night: data.night,
          users: data.name,
          isMafia: data.isMafia,
          isDead: data.isDead,
        },
      });
      console.log(data);
    }
  });

  socket.on("users", (data) => {
    let tempGamerList = [];
    setGamerList(tempGamerList);
    for (let i = 0; i < data.name.length; i++) {
      let temp = [data.name[i]];

      tempGamerList.push(temp);
    }

    setGamerList(tempGamerList);
  });

  const send = () => {
    socket.emit("send", {
      start: true,
      day: dayTime,
      night: nightTime,
      mafia: mafiaCount,
    });
  };
  return (
    <React.Fragment>
      <div>
        <Panel list={gamerList} />
      </div>
      <div id="ready">
        <div className="control-units">
          낮 / 밤: <input onChange={dayTimeHandler} /> /{" "}
          <input onChange={nightTimeHandler} />
        </div>
        <div className="control-units">
          총 인원 / 마피아 : {gamerList.length} /{" "}
          <input onChange={mafiaCountHandler} />
        </div>
        <button onClick={startButtonHandler}>시작</button>
      </div>
    </React.Fragment>
  );
};

export default Ready;
