import toolRegistry from "./registry";

const RenderInternalToolLazy = (props) => {
  debugger;
  if (props && props.toolName && props.toolID) {
    const InternalTool = toolRegistry[props.toolName];
    return <InternalTool toolID={props.toolID} />;
  }
  const Tool404 = toolRegistry["Tool404"];
  return <Tool404 />;
};

export default RenderInternalToolLazy;
