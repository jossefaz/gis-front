import types from "../actions/actionsTypes";
import produce from "immer";

export default function (state = {}, action) {
  switch (action.type) {
    case types.SET_SELECTED_FEATURES:
      return produce(state, (draftState) => {
        draftState.selectedFeatures = action.payload;
      });

    default:
      return state;
  }
}
