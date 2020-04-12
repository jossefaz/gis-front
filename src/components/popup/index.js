import React from "react";
import Draggable from "react-draggable";

const PopUp = (props) => {
  return (
    <Draggable>
      <div
        className="box"
        style={{
          position: "absolute",
          bottom: "100px",
          right: "100px",
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
