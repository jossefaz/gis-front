import types from "./actionsTypes";
import { getFocusedMapProxy } from "../../nessMapping/api";
export const setSelectedFeatures = (features) => (dispatch) => {
  if (features) {
    const focusedmap = getFocusedMapProxy().uuid.value;
    const featuresByLayers = {};
    features.map((f) => {
      const layer = f.id_.split(".")[0];
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
        geometry: f.values_.geometry,
        id: f.id_,
        ol_feature: f,
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

export const setCurrentLayer = (currentLayer) => (dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_CURRENT_LAYER,
    payload: { currentLayer, focusedmap },
  });
};
