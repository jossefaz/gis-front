import types from "./actionsTypes";

export const toggleTool = (ToolId) => (dispatch) =>
  dispatch({
    type: types.TOGGLE_TOOLS,
    payload: ToolId,
  });

export const InitTools = (ToolConfig) => (dispatch) => {
  const gTools = {
    tools: {},
    Groups: {},
  };

  ToolConfig.groups.map((group) => {
    gTools.Groups[group.Id] = group;
  });

  ToolConfig.tools.map((tool) => {
    const { Id, ToolGroupId } = tool;
    gTools.tools[Id] = tool;
    if (ToolGroupId) {
      "tools" in gTools.Groups[ToolGroupId]
        ? gTools.Groups[ToolGroupId].tools.push(Id)
        : (gTools.Groups[ToolGroupId]["tools"] = [Id]);
    }
  });
  dispatch({
    type: types.INIT_TOOLS,
    payload: gTools,
  });
};
