import React, { useEffect, useState } from "react";
import { renderTools } from "../../components/tool/RenderTool";
import { MapsToolState } from "../../state/stateTypes";
import { ListGroup } from "react-bootstrap";
import _ from "lodash";
import { useActions } from "../../hooks/useActions";

const TopNav: React.FC<{ Tools: MapsToolState | false }> = (props) => {
  const [opened, setOpened] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const timeDelay = isOver ? 350 : 100;

    const timeoutId = window.setTimeout(() => {
      setOpened(isOver);
    }, timeDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOver]);

  return (
    <div
      onMouseEnter={() => setIsOver(true)}
      onMouseLeave={() => setIsOver(false)}
      className={"main-nav" + (opened ? "" : " main-nav--closed")}
    >
      <ListGroup>
        {props.Tools && renderTools(props.Tools, "TopNav", sideOpenEffect)}
      </ListGroup>
    </div>
  );
};

export default React.memo(TopNav, (props, nextProps) => {
  const tools = props.Tools;
  const nextTools = nextProps.Tools;

  return !(
    tools !== nextTools &&
    tools &&
    nextTools &&
    Object.keys(tools.tools).length !== Object.keys(nextTools.tools).length
  );
});
