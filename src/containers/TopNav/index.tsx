import React, { useState } from "react";
import { renderTools } from "../../components/tool/RenderTool";
import { MapsToolState } from "../../state/stateTypes";
import { ListGroup } from "react-bootstrap";
import _ from "lodash";
import { useActions } from "../../hooks/useActions";

const TopNav: React.FC<{ Tools: MapsToolState | false }> = (props) => {
  const [opened, setOpened] = useState(false);
  const { toogleSideNav } = useActions();
  const sideOpenEffect = () => {
    setOpened(false);
    toogleSideNav(false);
  };
  return (
    <div
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
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
