import React from "react";
import PopUp from "../../popup";
import Iframe from "react-iframe";

const ExternalTool = (props) => {
  return <Iframe url={props.url} toolID={props.toolID} />;
};

export default ExternalTool;
