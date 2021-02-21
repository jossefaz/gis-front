import types from "../actions/types";
import produce from "immer";
import { ToolState } from "../types/tools";

const InitialState = {
  blueprint: {
    tools: {},
    Groups: {}
  },
};

const reducer = (state: ToolState = InitialState, action): ToolState => {
  switch (action.type) {
    case types.INIT_TOOLS:
      return produce(state, (draftState) => {
        const { gTools, mapId, blueprint } = action.payload;
        draftState[mapId] = gTools;
        draftState.blueprint = blueprint;
      });

    case types.TOGGLE_TOOLS:
      return produce(state, (draftState) => {
        const { ToolId, mapId, forceOpen, forceClose } = action.payload;
        if (!(mapId in draftState)) {
          return state;
        }

        const currentMapTools = draftState[mapId];
        const currentToolId = parseInt(ToolId);
        const IsOpen = currentMapTools.tools[currentToolId].IsOpen;
        const unfocus = currentMapTools.order[0];

        if (unfocus && unfocus !== currentToolId) {
          currentMapTools.unfocus = unfocus;
        }

        const futureToolStatus = forceOpen
          ? true
          : forceClose
            ? false
            : !IsOpen;

        currentMapTools.tools[currentToolId].IsOpen = futureToolStatus;
        if (futureToolStatus) {
          currentMapTools.order.unshift(currentToolId); // This tool is now Focused
        } else {
          const index = currentMapTools.order.indexOf(currentToolId);
          if (index > -1) {
            currentMapTools.order = currentMapTools.order.filter(
              (id) => id != currentToolId
            ); // remove this tool from open tool list
          }
        }
      });

    case types.RESET_TOOLS || types.INIT_MAP:
      return produce(state, (draftState) => {
        const { tools, mapId } = action.payload;
        draftState[mapId].reset = tools;
      });

    case types.TOOL_RESETED:
      return produce(state, (draftState) => {
        draftState[action.payload].reset = [];
      });

    case types.INIT_MAP:
      return produce(state, (draftState) => {
        draftState[action.payload] = {
          tools: {},
          Groups: {},
          order: [],
          reset: [],
          unfocus: "",
        };
        if (draftState.blueprint.tools) {
          draftState[action.payload].tools = JSON.parse(
            JSON.stringify(draftState.blueprint.tools)
          );
          draftState[action.payload].Groups = JSON.parse(
            JSON.stringify(draftState.blueprint.Groups)
          );
        }
      });

    case types.SET_TOOL_PROP:
      return produce(state, (draftState) => {
        const { config, mapId } = action.payload;
        draftState[mapId].tools[config.toolID][config.key] = config.value;
      });

    case types.SET_TOOL_FOCUSED:
      // First check if this tool is open
      const { ToolId, mapId } = action.payload;
      const currentToolId = parseInt(ToolId);
      const index = state[mapId].order.indexOf(currentToolId);
      if (index == -1) {
        return state; //if the tool was removed no need to focus it
      }
      return produce(state, (draftState) => {
        const currentMapTools = draftState[mapId];
        const unfocus = currentMapTools.order[0];
        if (unfocus && unfocus !== currentToolId) {
          currentMapTools.unfocus = unfocus;
        }
        currentMapTools.order = currentMapTools.order.filter(
          (id) => id != currentToolId
        );
        currentMapTools.order.unshift(currentToolId);
      });

    case types.TOGGLE_GROUP_TOOLS:
      return produce(state, (draftState) => {
        const { GroupToolId, mapId } = action.payload;
        const IsOpen = draftState[mapId].Groups[GroupToolId].IsOpen;
        draftState[mapId].Groups[GroupToolId].IsOpen = !IsOpen;
      });

    case types.UNSET_UNFOCUSED:
      return produce(state, (draftState) => {
        const { toolID, mapId } = action.payload;
        if (toolID == draftState[mapId].unfocus) {
          draftState[mapId].unfocus = "";
        }
      });

    default:
      return state;
  }
}

export default reducer;
