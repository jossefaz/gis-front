import React, { Suspense } from "react";
import ToolTemplate from "./Template";
import InternalTool from "./InternalTool";
import { useTypedSelector } from "../../hooks/useTypedSelectors";
import { selectFocusedMapTools } from "../../state/reducers";

const Loader: React.FC<{ ToolID: string }> = (props) => {
  const currentTools = useTypedSelector(selectFocusedMapTools);
  if (currentTools) {
    const { ToolName } = currentTools.tools[props.ToolID];
    const focused = currentTools.dynamicTools[0] === props.ToolID;
    return (
      <React.Fragment>
        <ToolTemplate
          focused={focused}
          toolName={ToolName}
          ToolID={props.ToolID}
        >
          <Suspense fallback={<div>Loading ...</div>}>
            <InternalTool toolName={ToolName} toolID={props.ToolID} />
          </Suspense>
        </ToolTemplate>
      </React.Fragment>
    );
  }
  return null;
};

export default Loader;
