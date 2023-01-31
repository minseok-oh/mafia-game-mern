import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Main.css";

const Main = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const send = async () => {
    const response = await fetch(`http://localhost:8080/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
      }),
    });
    console.log(response);
  };

  const inputNameHandler = (name) => {
    setUserName(name.target.value);
  };
  const attendButtonHandler = () => {
    send();
    navigate(`/ready/${userName}`, { state: { name: userName } });
  };

  return (
    <div id="main">
      <img src="assets/main.png" alt="없음" />
      <br />
      <input
        onChange={inputNameHandler}
        type="name"
        placeholder="Enter the name"
      />
      <button
        variant="primary"
        type="submit"
        onClick={attendButtonHandler}
        id="main-button"
      >
        참가
      </button>
    </div>
  );
};

export default Main;
