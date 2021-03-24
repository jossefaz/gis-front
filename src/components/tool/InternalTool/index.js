import toolRegistry from "./registry";

const RenderInternalToolLazy =  (props) => {
  const InternalTool = toolRegistry[props.toolName];
  return <InternalTool toolID={props.toolID} />;
};

export default RenderInternalToolLazy