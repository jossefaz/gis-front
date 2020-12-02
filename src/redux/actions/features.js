import types from "./actionsTypes";
import { getFocusedMapProxy } from "../../nessMapping/api";
export const setSelectedFeatures = (features) => (dispatch) => {
  if (features) {
    const focusedmap = getFocusedMapProxy().uuid.value;
    const featuresByLayers = {};
    features.map((f) => {
      let layer;
      const parentuuid = f.get("__NessUUID__");
      f.unset("__NessUUID__");
      try {
        layer = f.getId().split(".")[0];
      } catch (error) {
        return false;
      }

      if (!(layer in featuresByLayers)) {
        featuresByLayers[layer] = [];
      }
      const properties = Object.keys(f.values_)
        .filter((key) => key !== "geometry")
        .reduce((obj, key) => {
          obj[key] = f.values_[key];
          return obj;
        }, {});
      featuresByLayers[layer].push({
        properties,
        id: f.getId(),
        type: layer,
        __Parent_NessUUID__: parentuuid,
      });
    });
    dispatch({
      type: types.SET_SELECTED_FEATURES,
      payload: { focusedmap, featuresByLayers },
    });
  }
};

export const setCurrentFeature = (featureId) => (dispatch, getState) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  if (focusedmap in getState().Features) {
    const { selectedFeatures, currentLayer } = getState().Features[focusedmap];
    const currentFeature = selectedFeatures[currentLayer].filter(
      (feature) => feature.id == featureId
    );
    dispatch({
      type: types.SET_CURRENT_FEATURE,
      payload: { focusedmap, currentFeature: currentFeature[0] },
    });
  }
};

export const updateFeature = (featureId, newFeature) => (
  dispatch,
  getState
) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  if (focusedmap in getState().Features) {
    dispatch({
      type: types.UPDATE_FEATURE,
      payload: { focusedmap, featureId, newFeature },
    });
  }
};

export const removeFeature = (featureId) => (dispatch, getState) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  if (focusedmap in getState().Features) {
    dispatch({
      type: types.REMOVE_FEATURE,
      payload: { focusedmap, featureId },
    });
  }
};

export const setCurrentLayer = (currentLayer) => (dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_CURRENT_LAYER,
    payload: { currentLayer, focusedmap },
  });
};

export const setSelectionForLayers = (arrayOfLayerId) => (dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_SPATIAL_LAYER_SELECTION,
    payload: { arrayOfLayerId, focusedmap },
  });
};
