import React from "react";
import PopUp from "../../popup";
import "./style.css";
const ToolTemplate = (props) => {
  return (
    <PopUp>
      <div className="ui segment cSegment">
        <div className="segmentControls">
          <a className="close" onClick={() => props.CloseTool()}></a>
        </div>
        {props.children}
      </div>
    </PopUp>
  );
};

export default ToolTemplate;
