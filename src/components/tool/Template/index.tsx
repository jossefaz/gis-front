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
  const {
    toggleTool,
    setToolFocused,
    closeDragTool,
    toogleSideNav,
  } = useActions();
  const issticky = useTypedSelector(selectStickyTool) === props.ToolID;

  function getStickyTemplate() {
    return (
      <div className="tool tool--sticky">
        <div className="tool__header">
          <div className="tool__name">{props.toolName}</div>
          <div
            className="tool__close"
            onClick={(e) => {
              e.stopPropagation();
              toggleTool(props.ToolID, false, false);
              toogleSideNav(true);
            }}
          >
            <i className="gis-icon gis-icon--minus"></i>
          </div>
        </div>

        <div>{props.children}</div>
      </div>
    );
  }

  function getDynamicTemplate() {
    return (
      <PopUp>
        <div className={`titlebar ${props.focused ? "focusedTool" : ""}`}>
          <div className="buttons">
            <div
              className="close"
              onClick={(e) => {
                e.stopPropagation();
                closeDragTool(props.ToolID, false, false);
              }}
            ></div>
          </div>
        </div>
        <div
          className={`window ${props.focused ? "focusedWindow" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setToolFocused(props.ToolID);
          }}
        >
          <div className="content uirtl">{props.children}</div>
        </div>
      </PopUp>
    );
  }

  return issticky ? getStickyTemplate() : getDynamicTemplate();
};

export default ToolTemplate;
