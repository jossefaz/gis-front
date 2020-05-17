import types from "../actions/actionsTypes";
import produce from "immer";


// selectedFeatures: {},
// currentLayer: null,
// currentFeature: null,
export default function (state = {}, action) {
  switch (action.type) {
    case types.SET_SELECTED_FEATURES:
      return produce(state, (draftState) => {
        const { focusedmap, featuresByLayers } = action.payload
        if (!(focusedmap in state)) {
          // if the current map does not have any selected feature yet : add the mapID in the state
          draftState[focusedmap] = {};
          // and make the featuresByLayers the current state of selected features
          draftState[focusedmap].selectedFeatures = featuresByLayers;
        } else {

          // if there was already selected features for this map : loop through the different layers that were selected
          Object.keys(state[focusedmap].selectedFeatures).map(
            layer => {
              // if this layer is in the new selection
              if (layer in featuresByLayers) {
                // give to this layer its new selection
                draftState[focusedmap].selectedFeatures[layer] = featuresByLayers[layer];
              } else {
                delete draftState[focusedmap].selectedFeatures[layer]
              }
            }
          )
          // add the others layers that never was in the selections 
          Object.keys(featuresByLayers).map(layer => {
            if (!(layer in draftState[focusedmap].selectedFeatures)) {
              // give to this layer its new selection
              draftState[focusedmap].selectedFeatures[layer] = featuresByLayers[layer];
            }
          })
        }


        draftState[focusedmap].currentLayer = Object.keys(featuresByLayers)[0];
        if (Object.keys(featuresByLayers[Object.keys(featuresByLayers)[0]]).length == 1) {
          draftState[focusedmap].currentFeature = featuresByLayers[Object.keys(featuresByLayers)[0]][0]
        }
      });


    case types.SET_CURRENT_FEATURE:
      return produce(state, (draftState) => {
        if (!(action.payload.focusedmap in state)) {
          draftState[action.payload.focusedmap] = {}
        }
        draftState[action.payload.focusedmap].currentFeature = action.payload.currentFeature;
      });

    case types.SET_CURRENT_LAYER:
      return produce(state, (draftState) => {
        if (!(action.payload.focusedmap in state)) {
          draftState[action.payload.focusedmap] = {}
        }
        draftState[action.payload.focusedmap].currentLayer = action.payload.currentLayer;
      });

    default:
      return state;
  }
}
