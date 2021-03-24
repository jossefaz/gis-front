import React from "react";
import Draggable from "react-draggable";
import "./style.css";
const PopUp = (props) => {
  const position = props.position || null;
  return (
    <Draggable positionOffset={position}>
      <div className="box" className="popup">
        {props.children}
      </div>
    </Draggable>
  );
};

export default PopUp;
