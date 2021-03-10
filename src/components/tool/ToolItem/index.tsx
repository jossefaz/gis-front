import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectFocusedMapTools } from "../../../state/reducers";

const ToolItem: React.FC<{ ToolID: string }> = (props) => {
  const currentTools = useTypedSelector(selectFocusedMapTools);
  const { toggleTool } = useActions();
  if (currentTools) {
    const { ToolName, ToolImage, ToolIcon } = currentTools.tools[props.ToolID];
    return (
      <a
        className="item"
        onClick={() => toggleTool(props.ToolID, false, false)}
      >
        {ToolIcon ? (
          <FontAwesomeIcon icon={ToolIcon} size="2x" />
        ) : ToolImage ? (
          <img src={`/img/${ToolImage}`} />
        ) : (
          ToolName
        )}
      </a>
    );
  }
  return null;
};

export default ToolItem;
