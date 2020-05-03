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

export const InitTools = (ToolConfig) => (dispatch) => {
  const gTools = {
    tools: {},
    Groups: {},
    order: [],
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
