import React from "react";
import Tool from "../../../components/tool";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import {
  selectDynamicTool,
  selectFocusedMapTools,
} from "../../../state/reducers";
import { useDrop } from "react-dnd";

const DynamicToolContainer: React.FC = () => {
  const Tools = useTypedSelector(selectFocusedMapTools);
  const toolsIds = Tools ? Object.keys(Tools).map((tid) => `${tid}`) : [];
  const drop = useDrop(() => ({
    accept: toolsIds,
    drop: () => ({ name: "MapContainer" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))[1];
  const currentTools = useTypedSelector(selectDynamicTool);
  console.log(`RENDER DYNAMIC`);
  return (
    <div ref={drop} role={"region"} id="DynamicToolContainer">
      {currentTools &&
        currentTools.map((toolId) => <Tool key={toolId} ToolID={toolId} />)}
    </div>
  );

  return null;
};

export default DynamicToolContainer;
