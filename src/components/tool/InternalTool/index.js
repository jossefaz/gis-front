import React from "react";
import toolRegistry from "./registry";
import ToolTemplate from "./Template";
const ExternalTool = (props) => {
  const InternalTool = toolRegistry[props.toolName];
  return (
    <ToolTemplate>
      <InternalTool />
    </ToolTemplate>
  );
};

export default ExternalTool;
