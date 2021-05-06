import types from "../actions/types";
import produce from "immer";
import { GisState, ToolState } from "../stateTypes";
import { Actions } from "../actions/types";

const reducer = (state: ToolState = {}, action: Actions): ToolState => {
  switch (action.type) {
    case types.INIT_TOOLS:
      return produce(state, (draftState) => {
        const { gTools, mapId, blueprint } = action.payload;
        draftState[mapId] = gTools;
        draftState.blueprint = blueprint;
      });

    case types.TOGGLE_STICKY_TOOLS:
      return produce(state, (draftState) => {
        const { ToolId, mapId, forceOpen, forceClose } = action.payload;
        if (!(mapId in draftState)) {
          return state;
        }
        const currentMapTools = draftState[mapId];
        const IsOpen = currentMapTools.tools[ToolId].IsOpen;
        const unfocus = currentMapTools.focused;
        const futureToolStatus = forceOpen
          ? true
          : forceClose
          ? false
          : !IsOpen;

        if (Boolean(unfocus) && unfocus !== ToolId) {
          currentMapTools.unfocus = unfocus;
          currentMapTools.tools[unfocus].IsOpen = false;
        }
        // If the tool is open in dynamic tools
        if (currentMapTools.dynamicTools.includes(ToolId)) {
          // Remove the tool from dynamic tools array
          currentMapTools.dynamicTools = currentMapTools.dynamicTools.filter(
            (id) => id !== ToolId
          );
          // Open it as Sticky tool
          currentMapTools.tools[ToolId].IsOpen = true;
          currentMapTools.focused = ToolId;
          currentMapTools.stickyTool = ToolId;
        } else {
          currentMapTools.tools[ToolId].IsOpen = futureToolStatus;
          currentMapTools.focused = futureToolStatus ? ToolId : "";
          currentMapTools.stickyTool = futureToolStatus ? ToolId : "";
        }
      });

    case types.CLOSE_DRAG_TOOLS:
      return produce(state, (draftState) => {
        const { ToolId, mapId } = action.payload;
        if (!(mapId in draftState)) {
          return state;
        }
        const currentMapTools = draftState[mapId];

        currentMapTools.unfocus = ToolId;
        currentMapTools.tools[ToolId].IsOpen = false;
        currentMapTools.dynamicTools = currentMapTools.dynamicTools.filter(
          (id) => id !== ToolId
        );
        currentMapTools.focused = "";
      });

    case types.DRAG_TOOL:
      return produce(state, (draftState) => {
        const { ToolId, mapId } = action.payload;
        if (!(mapId in draftState)) {
          return state;
        }

        const currentMapTools = draftState[mapId];
        const unfocus = currentMapTools.dynamicTools[0];

        if (unfocus && unfocus !== ToolId) {
          currentMapTools.unfocus = unfocus;
        }
        if (ToolId === currentMapTools.stickyTool) {
          currentMapTools.stickyTool = "";
        }
        currentMapTools.tools[ToolId].IsOpen = true;
        currentMapTools.dynamicTools.unshift(ToolId); // This tool is now Focused
        currentMapTools.focused = ToolId;
        currentMapTools.dynamicTools = [
          ...new Set(currentMapTools.dynamicTools),
        ];
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
          dynamicTools: [],
          displayOrder: [],
          reset: [],
          unfocus: undefined,
          focused: "",
          stickyTool: "",
        };
        if (
          draftState.blueprint &&
          draftState.blueprint.tools &&
          draftState.blueprint.displayOrder
        ) {
          draftState[action.payload].tools = JSON.parse(
            JSON.stringify(draftState.blueprint.tools)
          );
          draftState[action.payload].Groups = JSON.parse(
            JSON.stringify(draftState.blueprint.Groups)
          );
          draftState[action.payload].displayOrder =
            draftState.blueprint.displayOrder;
        }
      });

    case types.SET_TOOL_FOCUSED:
      // First check if this tool is open
      const { ToolId, mapId } = action.payload;
      const isDynamicTool = state[mapId].dynamicTools.indexOf(ToolId) !== -1;
      const isFixedTool = state[mapId].stickyTool !== "";
      if (!isDynamicTool && !isFixedTool) {
        console.warn(`unknown toolid tried to be focused ${ToolId}`);
        return state;
      }

      if (isDynamicTool) {
        return produce(state, (draftState) => {
          const currentMapTools = draftState[mapId];
          const unfocus = currentMapTools.dynamicTools[0];
          if (unfocus && unfocus !== ToolId) {
            currentMapTools.unfocus = unfocus;
            currentMapTools.tools[unfocus].IsOpen = false;
          }
          currentMapTools.dynamicTools = currentMapTools.dynamicTools.filter(
            (id) => id !== ToolId
          );
          currentMapTools.dynamicTools.unshift(ToolId);
          currentMapTools.focused = ToolId;
          currentMapTools.dynamicTools = [
            ...new Set(currentMapTools.dynamicTools),
          ];
        });
      } else {
        return produce(state, (draftState) => {
          const currentMapTools = draftState[mapId];
          const unfocus = currentMapTools.focused;
          if (unfocus && unfocus !== ToolId) {
            currentMapTools.unfocus = unfocus;
            currentMapTools.tools[unfocus].IsOpen = false;
          }
          currentMapTools.focused = ToolId;
        });
      }

    case types.TOGGLE_GROUP_TOOLS:
      return produce(state, (draftState) => {
        const { GroupToolId, mapId } = action.payload;
        const IsOpen = draftState[mapId].Groups[GroupToolId].IsOpen;
        draftState[mapId].Groups[GroupToolId].IsOpen = !IsOpen;
      });

    case types.UNSET_UNFOCUSED_TOOL:
      return produce(state, (draftState) => {
        const { ToolId, mapId } = action.payload;
        if (ToolId === draftState[mapId].unfocus) {
          draftState[mapId].unfocus = "";
        }
      });

    default:
      return state;
  }
};

export default reducer;

export const selectDynamicTool = (state: GisState) => {
  const { Tools, map } = state;
  if (
    Tools &&
    map.focused in Tools &&
    Tools[map.focused].dynamicTools.length > 0
  ) {
    return Tools[map.focused].dynamicTools;
  }
  return false;
};

export const selectStickyTool = (state: GisState) => {
  const { Tools, map } = state;
  if (
    Tools &&
    map.focused in Tools &&
    Tools[map.focused].stickyTool.length > 0
  ) {
    return Tools[map.focused].stickyTool;
  }
  return false;
};

export const selectFocusedMapTools = (state: GisState) => {
  const { Tools, map } = state;
  if (Tools && map.focused in Tools && Tools[map.focused]) {
    return Tools[map.focused];
  }
  return false;
};
