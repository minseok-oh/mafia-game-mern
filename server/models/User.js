const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 20,
  },
  isDead: {
    type: Boolean,
    default: false,
  },
  isMafia: {
    type: Boolean,
    default: false,
  },
  id: mongoose.Schema.Types.ObjectId,
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
