import React from "react";
import toolRegistry from "./registry";

export default (props) => {
  const InternalTool = toolRegistry[props.toolName];
  return <InternalTool />;
};
