import React, { useState } from "react";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectFocusedMapTools } from "../../../state/reducers";
import { useDrag } from "react-dnd";
import { ControlPosition } from "react-draggable";
import { ListGroup } from "react-bootstrap";

enum ItemTypes {
  TOOL = "TOOL",
}

export interface BoxProps {
  name: string;
}

interface Props {
  ToolID: string;
  sideEffectOnToolOpen?: () => void;
}

const ToolItem: React.FC<Props> = (props) => {
  const currentTools = useTypedSelector(selectFocusedMapTools);
  const { toggleTool, dragTool, toogleSideNav } = useActions();

  const drag = useDrag(() => ({
    type: ItemTypes.TOOL,
    item: { name: props.ToolID },
    end: (item, monitor) => {
      const pos = monitor.getClientOffset();
      if (item && pos) {
        dragTool(item.name, { x: pos.x - 2500, y: pos.y });
        toogleSideNav(true);
      }
    },
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
  }))[1];

  if (currentTools) {
    const { ToolIcon, ToolTip } = currentTools.tools[props.ToolID];

    return (
      <ListGroup.Item className="tool-item" role={`${props.ToolID}`} ref={drag}>
        <div
          className="tool-item__main"
          onClick={() => {
            toggleTool(props.ToolID, false, false);
            props.sideEffectOnToolOpen && props.sideEffectOnToolOpen();
          }}
        >
          <div className="tool-item__icon mx-1">
            {ToolIcon ? (
              <i className={"gis-icon gis-icon--" + ToolIcon}></i>
            ) : (
              <i>i</i>
            )}
          </div>
          <div className="tool-item__title flex-grow-1 mx-2">{ToolTip}</div>
        </div>

        <div className="tool-item__drag" data-testid={`box-${props.ToolID}`}>
          <i className="gis-icon gis-icon--drag-thin"></i>
        </div>
      </ListGroup.Item>
    );
  }
  return null;
};

export default ToolItem;
