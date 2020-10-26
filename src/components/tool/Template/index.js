import React from "react";
import PopUp from "../../popup";
import "./style.css";
const ToolTemplate = (props) => {

  

  return (
    <PopUp>
      <div
        className={`window ${props.focused ? "focusedWindow" : ""}`}
        onClick={() => props.FocusMe()}
      >
        <div className={`titlebar ${props.focused ? "focusedTool" : ""}`}>
          <div className="buttons">
            <div className="close">
              <a className="closebutton" onClick={() => props.CloseTool()}>
                <span>
                  <strong>x</strong>
                </span>
              </a>
            </div>
          </div>
          {props.toolName}
        </div>
        <div className="content uirtl">{props.children}</div>
      </div>
    </PopUp>
  );
};

export default ToolTemplate;
