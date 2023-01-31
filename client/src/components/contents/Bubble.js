import React from "react";
import "../style/Bubble.css";

const Bubble = (props) => {
  const clickBubbleHandler = (data) => {
    props.onCheckId(data.target.id);
  };

  if (props.isDead) {
    return (
      <div id={props.id} onClick={clickBubbleHandler} className="bubble_dead">
        {props.name}
      </div>
    );
  } else if (props.id === Number(props.selected)) {
    return (
      <div
        id={props.id}
        onClick={clickBubbleHandler}
        className="bubble_selected"
      >
        {props.name}
      </div>
    );
  } else {
    return (
      <div id={props.id} onClick={clickBubbleHandler} className="bubble">
        {props.name}
      </div>
    );
  }
};

export default Bubble;
