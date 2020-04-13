import React from "react";
import toolRegistry from "./registry";

const ExternalTool = (props) => {
  const InternalTool = toolRegistry[props.toolName];
  return <InternalTool />;
};

export default ExternalTool;
