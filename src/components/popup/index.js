import React from "react";
import Draggable from "react-draggable";
import "./style.css";
const PopUp = (props) => {
  return (
    <Draggable>
      <div className="box" className="popup">
        {props.children}
      </div>
    </Draggable>
  );
};

export default PopUp;
