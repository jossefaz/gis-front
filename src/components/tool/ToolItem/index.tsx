import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectFocusedMapTools } from "../../../state/reducers";
import { useDrag } from "react-dnd";
import { ListGroup } from "react-bootstrap";

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
    const { ToolName, ToolImage, ToolIcon, ToolTip } = currentTools.tools[props.ToolID];

    return (
      <ListGroup.Item className="tool-item" role="TOOL">
         
        <div className="tool-item__main" onClick={() => toggleTool(props.ToolID, false, false)}>
          <div className="tool-item__icon mx-1">
            {ToolIcon ? <i className={'gis-icon gis-icon--' + ToolIcon}></i> : <i>i</i>}
          </div>
          <div className="tool-item__title flex-grow-1 mx-2">{ToolTip}</div>
        </div>

        <div className="tool-item__drag" ref={drag} data-testid={`box-${props.ToolID}`}>
          <i className="gis-icon gis-icon--drag-thin"></i>
        </div>
        
      </ListGroup.Item>
    );

    
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
