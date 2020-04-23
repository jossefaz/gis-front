import types from "../actions/actionsTypes";
import produce from "immer";

export default function (state = {}, action) {
  switch (action.type) {
    case types.SET_SELECTED_FEATURES:
      return produce(state, (draftState) => {
        draftState.selectedFeatures = action.payload;
        if (action.payload.length == 1) {
          draftState.currentFeature = action.payload[0];
        }
      });

    case types.SET_CURRENT_FEATURE:
      return produce(state, (draftState) => {
        draftState.currentFeature = action.payload;
      });

    default:
      return state;
  }
}