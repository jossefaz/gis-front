import React from "react";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectStickyTool } from "../../../state/reducers";
import PopUp from "../../popup";
import "./style.css";

interface Props {
  ToolID: string;
  focused: boolean;
  toolName: string;
}

const ToolTemplate: React.FC<Props> = (props) => {
  const { toggleTool, setToolFocused, closeDragTool } = useActions();
  const issticky = useTypedSelector(selectStickyTool) === props.ToolID;

  return (
    <PopUp>
      <div
        className={`window ${props.focused ? "focusedWindow" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setToolFocused(props.ToolID);
        }}
      >
        <div className={`titlebar ${props.focused ? "focusedTool" : ""}`}>
          <div className="buttons">
            <div className="close">
              <a
                className="closebutton"
                onClick={(e) => {
                  e.stopPropagation();
                  issticky
                    ? toggleTool(props.ToolID, false, false)
                    : closeDragTool(props.ToolID, false, false);
                }}
              >
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
