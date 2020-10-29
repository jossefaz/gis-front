import types from "../actions/actionsTypes";
import produce from "immer";

// selectedFeatures: {},
// currentLayer: null,
// currentFeature: null,
export default function (state = {}, action) {
  switch (action.type) {
    case types.SET_SELECTED_FEATURES:
      return produce(state, (draftState) => {
        const { focusedmap, featuresByLayers } = action.payload;
        if (!(focusedmap in state)) {
          // if the current map does not have any selected feature yet : add the mapID in the state
          draftState[focusedmap] = {};
        }
        draftState[focusedmap].selectedFeatures = featuresByLayers;
        draftState[focusedmap].currentLayer = Object.keys(featuresByLayers)[0];
        draftState[focusedmap].currentFeature = null;
        // if (Object.keys(featuresByLayers[Object.keys(featuresByLayers)[0]]).length == 1) {
        //   // if there is only one feature : select it
        //   draftState[focusedmap].currentFeature = featuresByLayers[Object.keys(featuresByLayers)[0]][0]
        // }
      });

    case types.SET_CURRENT_FEATURE:
      return produce(state, (draftState) => {
        if (!(action.payload.focusedmap in state)) {
          draftState[action.payload.focusedmap] = {};
        }
        draftState[action.payload.focusedmap].currentFeature =
          action.payload.currentFeature;
      });

    case types.SET_CURRENT_LAYER:
      return produce(state, (draftState) => {
        if (!(action.payload.focusedmap in state)) {
          draftState[action.payload.focusedmap] = {};
        }
        draftState[action.payload.focusedmap].currentLayer =
          action.payload.currentLayer;
      });

    default:
      return state;
  }
}
