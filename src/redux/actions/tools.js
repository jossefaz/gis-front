import types from "./actionsTypes";

export const toggleTool = (ToolId) => (dispatch) =>
  dispatch({
    type: types.TOGGLE_TOOLS,
    payload: ToolId,
  });

export const InitTools = (ToolConfig) => (dispatch) => {
  const AllTools = {};
  ToolConfig.map((tool) => {
    AllTools[tool.Id] = tool;
  });
  dispatch({
    type: types.INIT_TOOLS,
    payload: AllTools,
  });
};
