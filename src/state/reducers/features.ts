import types from "../actions/types";
import { FeatureState } from "../stateTypes";
import produce from "immer";
import { Actions } from "../actions/types";
import { GisState } from "../stateTypes";
import { SelectedFeature } from "../../core/types";

const getinitialFeatureState = () => {
  return {
    selectedFeatures: {},
    currentLayer: null,
    currentFeature: null,
  };
};

const reducer = (state: FeatureState = {}, action: Actions): FeatureState => {
  switch (action.type) {
    case types.SET_SELECTED_FEATURES:
      return produce(state, (draftState) => {
        const { focusedmap, featuresByLayers } = action.payload;
        if (!(focusedmap in state)) {
          // if the current map does not have any selected feature yet : add the mapID in the state
          draftState[focusedmap] = getinitialFeatureState();
        }
        draftState[focusedmap].selectedFeatures = featuresByLayers;
        draftState[focusedmap].currentLayer = Object.keys(featuresByLayers)[0];
        draftState[focusedmap].currentFeature =
          featuresByLayers[Object.keys(featuresByLayers)[0]][0];
      });

    case types.SET_CURRENT_FEATURE:
      return produce(state, (draftState) => {
        if (!(action.payload.focusedmap in state)) {
          draftState[action.payload.focusedmap] = getinitialFeatureState();
        }
        draftState[action.payload.focusedmap].currentFeature =
          action.payload.currentFeature;
      });

    case types.UPDATE_FEATURE:
      return produce(state, (draftState) => {
        const { focusedmap, featureId, newFeature } = action.payload;
        const currentLayer = draftState[focusedmap].currentLayer;
        if (currentLayer) {
          const index = draftState[focusedmap].selectedFeatures[
            currentLayer
          ].findIndex((el) => el.id === featureId);
          if (index !== -1) {
            draftState[focusedmap].selectedFeatures[currentLayer].splice(
              index,
              1,
              newFeature
            );
            const currentFeature =
              draftState[action.payload.focusedmap].currentFeature;
            if (currentFeature && currentFeature.id === featureId) {
              draftState[action.payload.focusedmap].currentFeature = newFeature;
            }
          }
        }
      });

    case types.REMOVE_FEATURE:
      return produce(state, (draftState) => {
        const { focusedmap, featureId } = action.payload;
        const currentLayer = draftState[focusedmap].currentLayer;
        if (currentLayer) {
          const index = draftState[focusedmap].selectedFeatures[
            currentLayer
          ].findIndex((el) => el.id === featureId);
          if (index !== -1) {
            draftState[focusedmap].selectedFeatures[currentLayer].splice(
              index,
              1
            );
            if (
              draftState[focusedmap].selectedFeatures[currentLayer].length === 0
            ) {
              delete draftState[focusedmap].selectedFeatures[currentLayer];
              draftState[focusedmap].currentLayer = null;
            }
            const currentFeature = draftState[focusedmap].currentFeature;
            if (currentFeature && currentFeature.id === featureId) {
              draftState[focusedmap].currentFeature = null;
            }
          }
        }
      });

    case types.SET_SPATIAL_LAYER_SELECTION:
      const { arrayOfLayerId, focusedmap } = action.payload;
      return produce(state, (draftState) => {
        if (!(focusedmap in state)) {
          draftState[focusedmap] = getinitialFeatureState();
        }
        draftState[focusedmap].spatialSelection = arrayOfLayerId;
      });

    case types.SET_CURRENT_FEATURE_LAYER:
      return produce(state, (draftState) => {
        const { focusedmap, currentFeatureLayer } = action.payload;
        if (!(focusedmap in state)) {
          draftState[focusedmap] = getinitialFeatureState();
        }
        draftState[focusedmap].currentLayer = currentFeatureLayer;
        draftState[focusedmap].currentFeature = null;
      });

    case types.SET_CONTEXT_MENU:
      return produce(state, (draftState) => {
        const { source, featureID, menu, focusedmap } = action.payload;
        if (!(focusedmap in state)) {
          draftState[focusedmap] = getinitialFeatureState();
        }
        if (!("contextMenus" in draftState[focusedmap])) {
          draftState[focusedmap].contextMenus = {};
        }
        if (!(source in draftState[focusedmap].contextMenus)) {
          draftState[focusedmap].contextMenus[source] = {};
        }
        draftState[focusedmap].contextMenus[source][featureID] = menu;
      });

    default:
      return state;
  }
};

export default reducer;

export const selectCurrentLayerUUID = (state: GisState) => {
  const { Features, map } = state;
  if (map.focused in Features && Features[map.focused].selectedFeatures) {
    const selectedFeatures = Features[map.focused].selectedFeatures || false;
    const currentLayer = Features[map.focused].currentLayer || false;
    const currentId =
      selectedFeatures &&
      currentLayer &&
      selectedFeatures[currentLayer].length > 0
        ? selectedFeatures[currentLayer][0].parentlayerProperties.uuid
        : false;
    return currentId;
  }
};

export const selectSelectedFeatures = (state: GisState) => {
  const { Features, map } = state;
  const selectedFiltered: SelectedFeature = {};
  if (map.focused in Features && Features[map.focused].selectedFeatures) {
    Object.keys(Features[map.focused].selectedFeatures).forEach((layername) => {
      if (Features[map.focused].selectedFeatures[layername].length > 0) {
        selectedFiltered[layername] =
          Features[map.focused].selectedFeatures[layername];
      }
    });
    return Object.keys(selectedFiltered).length > 0 ? selectedFiltered : false;
  }
  return false;
};

export const selectCurrentLayer = (state: GisState) => {
  const { Features, map } = state;
  if (map.focused && map.focused in Features) {
    const currentLayer = Features[map.focused].currentLayer || false;
    return currentLayer;
  }
};

export const selectCurrentFeature = (state: GisState) => {
  const { Features, map } = state;
  if (Features && map.focused in Features) {
    return Features[map.focused].currentFeature;
  }
  return false;
};

export const selectSelectedFeatureInCurrentLayer = (state: GisState) => {
  const layer = selectCurrentLayer(state);
  const features = selectSelectedFeatures(state);
  if (layer && features && layer in features) {
    return features[layer];
  }
  return false;
};

export const selectContextMenus = (state: GisState) => {
  const { Features, map } = state;
  if (map.focused in Features && "contextMenus" in Features[map.focused]) {
    return Features[map.focused].contextMenus;
  }
  return false;
};

export const selectSelectionLayers = (state: GisState) => {
  const { Features, map } = state;
  if (map.focused in Features && "spatialSelection" in Features[map.focused]) {
    return Features[map.focused].spatialSelection;
  }
  return [];
};
