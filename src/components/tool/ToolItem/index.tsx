import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectFocusedMapTools } from "../../../state/reducers";
import { useDrag } from "react-dnd";

enum ItemTypes {
  TOOL = "TOOL",
}

export interface BoxProps {
  name: string;
}

interface DropResult {
  name: string;
}

const ToolItem: React.FC<{ ToolID: string }> = (props) => {
  const currentTools = useTypedSelector(selectFocusedMapTools);
  const { toggleTool, dragTool } = useActions();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TOOL,
    item: { name: props.ToolID },
    end: (item, monitor) => {
      if (item) {
        dragTool(item.name);
        // alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  if (currentTools) {
    const { ToolName, ToolImage, ToolIcon } = currentTools.tools[props.ToolID];
    return (
      <div ref={drag} role="TOOL" data-testid={`box-${props.ToolID}`}>
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
      </div>
    );
  }
  return null;
};

export default ToolItem;
