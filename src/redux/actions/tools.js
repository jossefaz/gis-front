import types from "./actionsTypes";

export const openTool = (ToolId) => (dispatch) =>
  dispatch({
    type: types.OPEN_TOOLS,
    payload: ToolId,
  });

export const InitTools = (ToolConfig) => (dispatch) => {
  const AllTools = {};

  dispatch({
    type: types.INIT_TOOLS,
    payload: AllTools,
  });
};
