import types from "./actionsTypes";

export const toggleTool = (ToolId) => (dispatch) =>
  dispatch({
    type: types.TOGGLE_TOOLS,
    payload: ToolId,
  });

export const InitTools = (ToolConfig) => (dispatch) => {
  const AllTools = {};

  dispatch({
    type: types.INIT_TOOLS,
    payload: AllTools,
  });
};
