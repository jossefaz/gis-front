import React from "react";
import ToolItem from "./ToolItem";
import ToolGroup from "./ToolGroup";
export const renderTools = (toolState, containerName) => {
  return toolState && containerName ? (
    <React.Fragment>
      {Object.keys(toolState.Groups).map((groupId) => {
        const { Id: GroupToolID, GroupContainer } = toolState.Groups[groupId];
        return GroupToolID && GroupContainer == containerName ? (
          <ToolGroup key={groupId} GroupID={groupId} />
        ) : null;
      })}
      {Object.keys(toolState.tools).map((toolId) => {
        const { ToolGroupId, ToolContainer } = toolState.tools[toolId];
        return !ToolGroupId && ToolContainer == containerName ? (
          <ToolItem key={toolId} ToolID={toolId} />
        ) : null;
      })}
    </React.Fragment>
  ) : null;
};
