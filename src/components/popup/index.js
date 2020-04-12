import React from "react";
import Draggable from "react-draggable";

const PopUp = (props) => {
  return (
    <Draggable>
      <div
        className="box"
        style={{
          position: "absolute",
          top: "5em",
          right: "20em",
          zIndex: "9",
          width: "450px",
          height: "450px",
        }}
      >
        {props.children}
      </div>
    </Draggable>
  );
};

export default PopUp;
