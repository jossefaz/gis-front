import React from "react";
import Tool from "../../../components/tool";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectDynamicTool } from "../../../state/reducers";
import { useDrop } from "react-dnd";

const DynamicToolContainer: React.FC = () => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "TOOL",
    drop: () => ({ name: "MapContainer" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const currentTools = useTypedSelector(selectDynamicTool);
  return (
    <div ref={drop} role={"region"} id="DynamicToolContainer">
      {currentTools &&
        currentTools.map((toolId) => <Tool key={toolId} ToolID={toolId} />)}
    </div>
  );
};

export default DynamicToolContainer;
