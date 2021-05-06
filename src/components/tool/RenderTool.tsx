import React from "react";
import ToolItem from "./ToolItem";
import ToolGroup from "./ToolGroup";
import { MapsToolState } from "../../state/stateTypes";
export const renderTools = (
  toolState: MapsToolState,
  containerName: string,
  sideEffectOnToolOpen?: () => void
) => {
  return toolState && containerName ? (
    <React.Fragment>
      {Object.keys(toolState.Groups).map((groupId) => {
        const { Id: GroupToolID, GroupContainer } = toolState.Groups[groupId];
        return GroupToolID && GroupContainer === containerName ? (
          <ToolGroup key={groupId} GroupID={groupId} />
        ) : null;
      })}
      {toolState.displayOrder.map((toolName) => {
        const metadata = Object.values(toolState.tools).filter(
          (md) => md.ToolName == toolName
        )[0];

        return metadata.ToolContainer &&
          metadata.ToolContainer === containerName ? (
          <ToolItem
            key={metadata.Id}
            ToolID={`${metadata.Id}`}
            sideEffectOnToolOpen={sideEffectOnToolOpen}
          />
        ) : null;
      })}
    </React.Fragment>
  ) : null;
};
