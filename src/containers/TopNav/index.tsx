import React from "react";

import { renderTools } from "../../components/tool/RenderTool";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SeachComp from "../../components/Search";
import { MapsToolState } from "../../state/stateTypes";
import { useActions } from "../../hooks/useActions";
const TopNav: React.FC<{ Tools: MapsToolState | false }> = (props) => {
  const { toogleSideNav } = useActions();

  return (
    <div className="ui top fixed menu ">
      <div className="item align left">
        <SeachComp />
      </div>
      {props.Tools && renderTools(props.Tools, "TopNav")}
      <button
        className="ui fixed item image pointerCursor"
        onClick={() => toogleSideNav()}
      >
        <FontAwesomeIcon icon="layer-group" size="lg" />
      </button>
    </div>
  );
};

export default React.memo(TopNav, (props, nextProps) => {
  const tools = props.Tools;
  const nextTools = nextProps.Tools;

  return (
    tools != nextTools &&
    tools &&
    nextTools &&
    Object.keys(tools.tools).length !== Object.keys(nextTools.tools).length
  );
});
