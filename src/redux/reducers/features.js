import types from "../actions/actionsTypes";
import produce from "immer";

const initialState = {
  selectedFeatures: [],
  currentFeature: null,
  Draw: {
    Session: false,
    Layer: null,
    DrawObject: null
  },
};
export default function (state = initialState, action) {
  switch (action.type) {
    case types.SET_SELECTED_FEATURES:
      return produce(state, (draftState) => {
        draftState.selectedFeatures = action.payload;
        if (action.payload.length == 1) {
          draftState.currentFeature = action.payload[0];
        }
      });
    case types.OPEN_DRAW_SESSION:
      return produce(state, (draftState) => {
        draftState.Draw = action.payload;
      });

    case types.CLOSE_DRAW_SESSION:
      return produce(state, (draftState) => {
        draftState.Draw.Session = false;
        draftState.Draw.Layer = null;
        draftState.Draw.DrawObject = null;

      });

    case types.SET_CURRENT_FEATURE:
      return produce(state, (draftState) => {
        draftState.currentFeature = action.payload;
      });

    default:
      return state;
  }
}
