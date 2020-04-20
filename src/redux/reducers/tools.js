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
            draftState.order = draftState.order.filter(
              (id) => id != currentToolId
            ); // remove this tool from open tool list
          }
        }
      });

    case types.SET_TOOL_FOCUSED:
      // First check if this tool is open
      const currentToolId = parseInt(action.payload);
      const index = state.order.indexOf(currentToolId);
      if (index == -1) {
        return state; //if the tool was removed no need to focus it
      }
      return produce(state, (draftState) => {
        const currentToolId = parseInt(action.payload);
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
