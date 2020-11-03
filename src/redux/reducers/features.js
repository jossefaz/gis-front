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
      });

    case types.SET_CURRENT_FEATURE:
      return produce(state, (draftState) => {
        if (!(action.payload.focusedmap in state)) {
          draftState[action.payload.focusedmap] = {};
        }
        draftState[action.payload.focusedmap].currentFeature =
          action.payload.currentFeature;
      });

    case types.UPDATE_FEATURE:
      return produce(state, (draftState) => {
        const { focusedmap, featureId, newFeature } = action.payload;
        const index = draftState[focusedmap].selectedFeatures[
          draftState[focusedmap].currentLayer
        ].findIndex((el) => el.id == featureId);
        draftState[focusedmap].selectedFeatures[
          draftState[focusedmap].currentLayer
        ].splice(index, 1, newFeature);
        if (
          draftState[action.payload.focusedmap].currentFeature.id == featureId
        ) {
          draftState[action.payload.focusedmap].currentFeature = newFeature;
        }
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
