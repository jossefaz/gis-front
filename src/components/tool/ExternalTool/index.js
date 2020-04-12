import React from "react";
import PopUp from "../../popup";
import Iframe from "react-iframe";

const ExternalTool = (props) => {
  return (
    <PopUp>
      <Iframe url={props.url} />
    </PopUp>
  );
};

export default ExternalTool;
