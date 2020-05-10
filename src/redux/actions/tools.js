import types from "./actionsTypes";
import { getRandomInt } from "../../utils/func";
import LifeCycleRegistry from "./LifeCycle";
export const toggleTool = (ToolId) => async (dispatch, getState) => {
  const toolConfig = getState().Tools.tools[ToolId];

  await _getLifeCycleFunc(toolConfig)(
    dispatch,
    getState,
    toolConfig.ToolName,
    toolConfig.IsOpen
  );

  dispatch({
    type: types.TOGGLE_TOOLS,
    payload: ToolId,
  });
};

export const toggleGroupTool = (GroupToolId) => (dispatch) =>
  dispatch({
    type: types.TOGGLE_GROUP_TOOLS,
    payload: GroupToolId,
  });

export const setToolFocused = (ToolId) => (dispatch) => {
  dispatch({
    type: types.SET_TOOL_FOCUSED,
    payload: ToolId,
  });
};

export const setToolProp = (config) => (dispatch) => {
  dispatch({
    type: types.SET_TOOL_PROP,
    payload: { config },
  });
}





export const resetTools = () => async (dispatch, getState) => {
  const tools = getState().Tools.order
  await _resetTools(tools, dispatch)
  dispatch({
    type: types.TOOL_RESETED
  });
}

export const InitTools = (ToolConfig) => (dispatch) => {
  const gTools = {
    tools: {},
    Groups: {},
    order: [],
    reset: [],
    blueprint: {}
  };

  ToolConfig.groups.map((group) => {
    gTools.Groups[group.Id] = group;
  });

  ToolConfig.tools.map((tool) => {
    const { Id, ToolGroupId } = tool;
    const RandomId = Id + getRandomInt();
    tool.Id = RandomId;
    gTools.tools[RandomId] = tool;
    if (ToolGroupId) {
      "tools" in gTools.Groups[ToolGroupId]
        ? gTools.Groups[ToolGroupId].tools.push(RandomId)
        : (gTools.Groups[ToolGroupId]["tools"] = [RandomId]);
    }
  });
  gTools.blueprint.tools = JSON.parse(JSON.stringify(gTools.tools))
  gTools.blueprint.Groups = JSON.parse(JSON.stringify(gTools.Groups))
  dispatch({
    type: types.INIT_TOOLS,
    payload: gTools,
  });
};

const _getLifeCycleFunc = (toolState) => {
  return toolState.IsOpen
    ? LifeCycleRegistry[toolState.OnDestroy]
    : LifeCycleRegistry[toolState.OnCreate];
};

const _resetTools = (toolsList, dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.RESET_TOOLS,
      payload: toolsList,
    });
    resolve();
  });
}
