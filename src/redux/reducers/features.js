import types from "../actions/actionsTypes";
import produce from "immer";
import { type } from "os";

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
        if (index != -1) {
          draftState[focusedmap].selectedFeatures[
            draftState[focusedmap].currentLayer
          ].splice(index, 1, newFeature);
          if (
            draftState[action.payload.focusedmap].currentFeature.id == featureId
          ) {
            draftState[action.payload.focusedmap].currentFeature = newFeature;
          }
        }
      });

    case types.REMOVE_FEATURE:
      return produce(state, (draftState) => {
        const { focusedmap, featureId } = action.payload;
        const index = draftState[focusedmap].selectedFeatures[
          draftState[focusedmap].currentLayer
        ].findIndex((el) => el.id == featureId);
        if (index != -1) {
          draftState[focusedmap].selectedFeatures[
            draftState[focusedmap].currentLayer
          ].splice(index, 1);
          if (
            draftState[focusedmap].selectedFeatures[
              draftState[focusedmap].currentLayer
            ].length === 0
          ) {
            delete draftState[focusedmap].selectedFeatures[
              draftState[focusedmap].currentLayer
            ];
            draftState[focusedmap].currentLayer = null;
          }
          if (draftState[focusedmap].currentFeature.id == featureId) {
            draftState[focusedmap].currentFeature = null;
          }
        }
      });

    case types.SET_SPATIAL_LAYER_SELECTION:
      const { arrayOfLayerId, focusedmap } = action.payload;
      return produce(state, (draftState) => {
        if (!(focusedmap in state)) {
          draftState[focusedmap] = {};
        }
        draftState[focusedmap].spatialSelection = arrayOfLayerId;
      });

    case types.SET_CURRENT_LAYER:
      return produce(state, (draftState) => {
        const { focusedmap, currentLayer } = action.payload;
        if (!(focusedmap in state)) {
          draftState[focusedmap] = {};
        }
        draftState[focusedmap].currentLayer = currentLayer;
        draftState[focusedmap].currentFeature = null;
      });

    default:
      return state;
  }
}

export const selectCurrentLayerUUID = (state) => {
  debugger;
  const { Features, map } = state;
  const selectedFeatures = Features[map.focused].selectedFeatures || false;
  const currentLayer = Features[map.focused].currentLayer || false;
  const currentId =
    selectedFeatures &&
    currentLayer &&
    selectedFeatures[currentLayer].length > 0
      ? selectedFeatures[currentLayer][0].__Parent_NessUUID__
      : false;
  return currentId;
};

export const selectSelectedFeatures = (state) => {
  const { Features, map } = state;
  if (map.focused in Features && "selectedFeatures" in Features[map.focused]) {
    return Features[map.focused].selectedFeatures;
  }
  return false;
};

export const selectCurrentLayer = (state) => {
  const { Features, map } = state;
  const currentLayer = Features[map.focused].currentLayer || false;
  return currentLayer;
};

export const selectCurrentFeature = (state) => {
  const { Features, map } = state;
  if (Features && map.focused in Features) {
    return Features[map.focused].currentFeature;
  }
  return false;
};

export const selectSelectedFeatureInCurrentLayer = (state) => {
  const layer = selectCurrentLayer(state);
  const features = selectSelectedFeatures(state);
  if (layer && features && layer in features) {
    return features[layer];
  }
  return false;
};

export const selectSelectionLayers = (state) => {
  const { Features, map } = state;
  if (map.focused in Features && "spatialSelection" in Features[map.focused]) {
    return Features[map.focused].spatialSelection;
  }
  return [];
};
