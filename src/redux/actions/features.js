import types from "./actionsTypes";
import { getFocusedMapProxy } from '../../nessMapping/api'
export const setSelectedFeatures = (features) => (dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value
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
    payload: { focusedmap, featuresByLayers }
  });
}



export const setCurrentFeature = (featureId) => (dispatch, getState) => {
  const focusedmap = getFocusedMapProxy().uuid.value
  if (focusedmap in getState().Features) {
    const { selectedFeatures, currentLayer } = getState().Features[focusedmap];
    const currentFeature = selectedFeatures[currentLayer].filter((feature) => feature.id == featureId);
    dispatch({
      type: types.SET_CURRENT_FEATURE,
      payload: { focusedmap, currentFeature: currentFeature[0] }
    });

  }

};

export const setCurrentLayer = (currentLayer) => (dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value
  dispatch({
    type: types.SET_CURRENT_LAYER,
    payload: { currentLayer, focusedmap },
  });
};
