import types from "./actionsTypes";
import { getEmptyVectorLayer, getDrawObject } from "../../utils/func";
export const setSelectedFeatures = (features) => (dispatch) => {
  const featuresByLayers = {}
  features.map(f => {
    const layer = f.id.split(".")[0]
    if (!(layer in featuresByLayers)) {
      featuresByLayers[layer] = []
    }
    featuresByLayers[layer].push(f)
  }
  )
  dispatch({
    type: types.SET_SELECTED_FEATURES,
    payload: featuresByLayers,
  });
}



export const setCurrentFeature = (featureId) => (dispatch, getState) => {
  const { selectedFeatures, currentLayer } = getState().Features;
  const currentFeature = selectedFeatures[currentLayer].filter((feature) => feature.id == featureId);
  dispatch({
    type: types.SET_CURRENT_FEATURE,
    payload: currentFeature[0],
  });
};

export const setCurrentLayer = (LayerName) => (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_LAYER,
    payload: LayerName,
  });
};
