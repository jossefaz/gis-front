import React, { useState } from "react";
import { renderTools } from "../../components/tool/RenderTool";
import { MapsToolState } from "../../state/stateTypes";
import { ListGroup } from "react-bootstrap";

const TopNav: React.FC<{ Tools: MapsToolState | false }> = (props) => {
  const [opened, setOpened] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
      className={"main-nav" + (opened ? "" : " main-nav--closed")}
    >
      <ListGroup>{props.Tools && renderTools(props.Tools, "TopNav")}</ListGroup>
    </div>
  );
};

export default React.memo(TopNav, (props, nextProps) => {
  const tools = props.Tools;
  const nextTools = nextProps.Tools;

  return (
    tools !== nextTools &&
    tools &&
    nextTools &&
    Object.keys(tools.tools).length !== Object.keys(nextTools.tools).length
  );
});
