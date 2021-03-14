import React from "react";
import Tool from "../../../components/tool";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectStickyTool } from "../../../state/reducers";

const StickyToolContainer: React.FC = () => {
  const currentToolId = useTypedSelector(selectStickyTool);
  return (
    <div>
      {currentToolId && <Tool key={currentToolId} ToolID={currentToolId} />}
    </div>
  );
};

export default StickyToolContainer;
