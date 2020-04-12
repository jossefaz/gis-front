import React from "react";
import PopUp from "../../popup";
import toolRegistry from "./registry";

const ExternalTool = (props) => {
  const InternalTool = toolRegistry[props.toolName];
  return <InternalTool />;
};

export default ExternalTool;
