import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Bubble from "../contents/Bubble";
import Modal from "./Modal";
import "../style/Game.css";
import io from "socket.io-client";

const Game = () => {
  const location = useLocation();
  const [count, setCount] = useState(Number(location.state.day));
  const [modalOpen, setModalOpen] = useState(false);
  const [isMafia, setIsMafia] = useState(location.state.isMafia);
  const [isSelected, setIsSelected] = useState(-1);
  const [isDay, setIsDay] = useState(true);
  const [isDead, setIsDead] = useState(location.state.isDead);

  const [citizenCount, setCitizenCount] = useState(0);
  const [mafiaCount, setMafiaCount] = useState(0);

  const gamerList = location.state.users;
  const userName = location.state.name;
  const [clientIsMafia, setClientIsMafia] = useState(false);
  const [gameEndCheck, setGameEndCheck] = useState(0);

  const socket = io();
  useEffect(() => {
    if (isMafia[gamerList.indexOf(userName)]) {
      setClientIsMafia(true);
    }

    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
    }, 5000);

    for (let i = 0; i < isMafia.length; i++) {
      if (isMafia[i]) setMafiaCount((mafiaCount) => mafiaCount + 1);
      else setCitizenCount((citizenCount) => citizenCount + 1);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);

    if (count === -1) {
      if (isDay) {
        setCount(Number(location.state.night));
      } else {
        setCount(Number(location.state.day));
      }

      socket.emit("select", {
        selected: isSelected,
        isMafia: clientIsMafia,
        isDay: isDay,
      });
      socket.on("selected", (data) => {
        console.log(data);
        let selected = [];
        for (let i = 0; i < isDead.length; i++) {
          selected.push(isDead[i]);
        }
        selected[data.selected] = true;
        setIsDead(selected);

        if (isMafia[data.selected]) {
          let nextMafiaCount = mafiaCount - 1;
          setMafiaCount(nextMafiaCount);
        } else {
          let nextCitizenCount = citizenCount - 1;
          setCitizenCount(nextCitizenCount);
        }
      });

      setIsDay(!isDay);
      setIsSelected(-1);
    }
    return () => clearInterval(id);
  });

  useEffect(() => {
    console.log(mafiaCount, citizenCount);
    if (mafiaCount === 0) {
      setGameEndCheck(2);
    }
    if (mafiaCount === citizenCount) {
      setGameEndCheck(1);
    }
    if (mafiaCount === 0 && citizenCount === 0) {
      setGameEndCheck(0);
    }
  }, [mafiaCount, citizenCount]);
  const onCheckId = (id) => {
    setIsSelected(id);
  };

  const rendering = () => {
    const result = [];
    for (let i = 0; i < gamerList.length; i += 2) {
      if (i === gamerList.length - 1) {
        result.push(
          <div className="users">
            <Bubble
              onCheckId={onCheckId}
              name={gamerList[i]}
              isDead={isDead[i]}
              id={i}
              selected={isSelected}
            />
          </div>
        );
      } else {
        result.push(
          <div className="users">
            <Bubble
              onCheckId={onCheckId}
              name={gamerList[i]}
              isDead={isDead[i]}
              id={i}
              selected={isSelected}
            />
            <Bubble
              onCheckId={onCheckId}
              name={gamerList[i + 1]}
              isDead={isDead[i + 1]}
              id={i + 1}
              selected={isSelected}
            />
          </div>
        );
      }
    }
    return result;
  };
  const day = () => {
    if (isDay) return <div>낮</div>;
    else return <div>밤</div>;
  };

  if (gameEndCheck === 0) {
    if (isDead[gamerList.indexOf(userName)]) {
      return <div>당신은 죽었습니다.</div>;
    } else {
      return (
        <React.Fragment>
          {rendering()}
          <h1>{count}</h1>
          {day()}
          {modalOpen && <Modal mafia={clientIsMafia} />}
        </React.Fragment>
      );
    }
  } else if (gameEndCheck === 1) {
    return <div>마피아 승!</div>;
  } else {
    return <div>시민 승!</div>;
  }
};

export default Game;
