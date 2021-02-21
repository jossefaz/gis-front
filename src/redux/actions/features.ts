import types from "./actionsTypes";
import { getFocusedMapProxy } from "../../nessMapping/api";
import OLFeature from "ol/Feature"
import { Feature } from "../types/feature"
import { Dispatch } from "redux";
import { SetCurrentFeatureAction, SetSelectedFeaturesAction } from "./types/features/actions"
import { GisState } from "../types/state"

export const setSelectedFeatures = (features: OLFeature[]) => (dispatch: Dispatch) => {
  if (features) {
    const focusedmap = getFocusedMapProxy().uuid.value;
    const featuresByLayers: { [layerid: string]: Feature[] } = {};
    features.map((f) => {
      let layer;
      const parentuuid = f.get("__NessUUID__");
      f.unset("__NessUUID__");
      let featureId = f.getId()
      if (featureId) {
        featureId = featureId.toString()
        layer = featureId.split(".")[0];
        if (!(layer in featuresByLayers)) {
          featuresByLayers[layer] = [];
        }
        const properties = f.getProperties()
        featuresByLayers[layer].push({
          properties,
          id: featureId,
          type: layer,
          __Parent_NessUUID__: parentuuid,
        });

      }
    });
    dispatch<SetSelectedFeaturesAction>({
      type: types.SET_SELECTED_FEATURES,
      payload: { focusedmap, featuresByLayers },
    });
  }
};

export const setCurrentFeature = (featureId: string) => (dispatch: Dispatch, getState: () => GisState) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  if (focusedmap in getState().Features) {
    const { selectedFeatures, currentLayer } = getState().Features[focusedmap];
    const currentFeature = selectedFeatures[currentLayer].filter(
      (feature: Feature) => feature.id == featureId
    );
    dispatch<SetCurrentFeatureAction>({
      type: types.SET_CURRENT_FEATURE,
      payload: { focusedmap, currentFeature: currentFeature[0] },
    });
  }
};

export const updateFeature = (featureId: string, newFeature) => (
  dispatch: Dispatch, getState: () => GisState
) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  if (focusedmap in getState().Features) {
    dispatch({
      type: types.UPDATE_FEATURE,
      payload: { focusedmap, featureId, newFeature },
    });
  }
};

export const removeFeature = (featureId: string) => (dispatch: Dispatch, getState: () => GisState) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  if (focusedmap in getState().Features) {
    dispatch({
      type: types.REMOVE_FEATURE,
      payload: { focusedmap, featureId },
    });
  }
};

export const setCurrentLayer = (currentLayer) => (dispatch: Dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_CURRENT_LAYER,
    payload: { currentLayer, focusedmap },
  });
};
export const setContextMenu = (source, featureID, menu) => (dispatch: Dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_CONTEXT_MENU,
    payload: { source, featureID, menu, focusedmap },
  });
};

export const setSelectionForLayers = (arrayOfLayerId) => (dispatch: Dispatch) => {
  const focusedmap = getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_SPATIAL_LAYER_SELECTION,
    payload: { arrayOfLayerId, focusedmap },
  });
};
