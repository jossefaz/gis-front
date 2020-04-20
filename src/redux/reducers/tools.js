import types from "../actions/actionsTypes";
import produce from "immer";

export default function (state = null, action) {
  switch (action.type) {
    case types.INIT_TOOLS:
      return action.payload;

    case types.TOGGLE_TOOLS:
      return produce(state, (draftState) => {
        const currentToolId = parseInt(action.payload);
        const IsOpen = draftState.tools[currentToolId].IsOpen;
        draftState.tools[currentToolId].IsOpen = !IsOpen;
        if (!IsOpen) {
          draftState.order.unshift(currentToolId); // This tool is now Focused
        } else {
          const index = draftState.order.indexOf(currentToolId);
          if (index > -1) {
            draftState.order.splice(index, 1); // remove this tool from open tool list
          }
        }
      });

    case types.SET_TOOL_FOCUSED:
      return produce(state, (draftState) => {
        const currentToolId = parseInt(action.payload);
        const index = draftState.order.indexOf(currentToolId);
        if (index > -1) {
          draftState.order.splice(index, 1); // remove this tool from open tool list
        }
        draftState.order.unshift(currentToolId);
      });

    case types.TOGGLE_GROUP_TOOLS:
      return produce(state, (draftState) => {
        const IsOpen = draftState.Groups[action.payload].IsOpen;
        draftState.Groups[action.payload].IsOpen = !IsOpen;
      });

    default:
      return state;
  }
}
