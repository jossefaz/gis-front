import React from "react";
import PopUp from "../../popup";
import Iframe from "react-iframe";

const ExternalTool = (props) => {
  return <Iframe url={props.url} />;
};

export default ExternalTool;
