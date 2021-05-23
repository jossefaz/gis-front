import React, { useEffect, useState } from "react";
import Draggable, { ControlPosition } from "react-draggable";
import { useActions } from "../../hooks/useActions";
import "./style.css";

const PopUp: React.FC<{
  position: ControlPosition;
  toolId: string;
}> = ({ position, toolId, children }) => {
  const { setToolPosition } = useActions();
  return (
    <Draggable
      cancel={"#DynamicToolContainer"}
      position={position}
      onDrag={(o, data) => {
        setToolPosition(toolId, {
          x: data.lastX,
          y: data.lastY,
        });
      }}
    >
      <div className="popup">{children}</div>
    </Draggable>
  );
};

export default PopUp;
