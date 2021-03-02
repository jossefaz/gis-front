import types from "../actions/types";
import produce from "immer";
import { ToolState } from "../stateTypes";
import { Actions } from "../actions/types";

const reducer = (state: ToolState = {}, action: Actions): ToolState => {
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
        const IsOpen = currentMapTools.tools[ToolId].IsOpen;
        const unfocus = currentMapTools.order[0];

        if (unfocus && unfocus !== ToolId) {
          currentMapTools.unfocus = unfocus;
        }

        const futureToolStatus = forceOpen
          ? true
          : forceClose
          ? false
          : !IsOpen;

        currentMapTools.tools[ToolId].IsOpen = futureToolStatus;
        if (futureToolStatus) {
          currentMapTools.order.unshift(ToolId); // This tool is now Focused
        } else {
          const index = currentMapTools.order.indexOf(ToolId);
          if (index > -1) {
            currentMapTools.order = currentMapTools.order.filter(
              (id) => id != ToolId
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
          unfocus: undefined,
        };
        if (draftState.blueprint && draftState.blueprint.tools) {
          draftState[action.payload].tools = JSON.parse(
            JSON.stringify(draftState.blueprint.tools)
          );
          draftState[action.payload].Groups = JSON.parse(
            JSON.stringify(draftState.blueprint.Groups)
          );
        }
      });

    case types.SET_TOOL_FOCUSED:
      // First check if this tool is open
      const { ToolId, mapId } = action.payload;
      const index = state[mapId].order.indexOf(ToolId);
      if (index == -1) {
        return state; //if the tool was removed no need to focus it
      }
      return produce(state, (draftState) => {
        const currentMapTools = draftState[mapId];
        const unfocus = currentMapTools.order[0];
        if (unfocus && unfocus !== ToolId) {
          currentMapTools.unfocus = unfocus;
        }
        currentMapTools.order = currentMapTools.order.filter(
          (id) => id != ToolId
        );
        currentMapTools.order.unshift(ToolId);
      });

    case types.TOGGLE_GROUP_TOOLS:
      return produce(state, (draftState) => {
        const { GroupToolId, mapId } = action.payload;
        const IsOpen = draftState[mapId].Groups[GroupToolId].IsOpen;
        draftState[mapId].Groups[GroupToolId].IsOpen = !IsOpen;
      });

    case types.UNSET_UNFOCUSED_TOOL:
      return produce(state, (draftState) => {
        const { ToolId, mapId } = action.payload;
        if (ToolId == draftState[mapId].unfocus) {
          draftState[mapId].unfocus = "";
        }
      });

    default:
      return state;
  }
};

export default reducer;
