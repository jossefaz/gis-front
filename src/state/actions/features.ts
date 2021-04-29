import types from "./types";
import API from "../../core/api";
import OLFeature from "ol/Feature";
import { Feature, ReduxLayer, SelectedFeature } from "../../core/types";
import { Dispatch } from "redux";
import {
  SetCurrentFeatureAction,
  SetSelectedFeaturesAction,
  UpdateFeatureAction,
  RemoveFeatureAction,
  SetCurrentFeatureLayerAction,
  SetContextMenuAction,
  SetSelectionForLayersAction,
} from "./types/features/actions";
import { GisState } from "../stateTypes";

export const setSelectedFeatures = (featuresByLayers: SelectedFeature) => (
  dispatch: Dispatch
) => {
  const focusedmap = API.map.getFocusedMapUUID();
  dispatch<SetSelectedFeaturesAction>({
    type: types.SET_SELECTED_FEATURES,
    payload: { focusedmap, featuresByLayers },
  });
};

export const setCurrentFeature = (featureId: string) => (
  dispatch: Dispatch,
  getState: () => GisState
) => {
  const focusedmap = API.map.getFocusedMapUUID();
  if (focusedmap in getState().Features) {
    const { selectedFeatures, currentLayer } = getState().Features[focusedmap];
    debugger;
    if (currentLayer) {
      const currentFeature = selectedFeatures[currentLayer].filter(
        (feature: Feature) => feature.id === featureId
      );
      dispatch<SetCurrentFeatureAction>({
        type: types.SET_CURRENT_FEATURE,
        payload: { focusedmap, currentFeature: currentFeature[0] },
      });
    }
  }
};

export const updateFeature = (featureId: string, newFeature: Feature) => (
  dispatch: Dispatch,
  getState: () => GisState
) => {
  const focusedmap = API.map.getFocusedMapUUID();
  if (focusedmap in getState().Features) {
    dispatch<UpdateFeatureAction>({
      type: types.UPDATE_FEATURE,
      payload: { focusedmap, featureId, newFeature },
    });
  }
};

export const removeFeature = (featureId: string) => (
  dispatch: Dispatch,
  getState: () => GisState
) => {
  const focusedmap = API.map.getFocusedMapUUID();
  if (focusedmap in getState().Features) {
    dispatch<RemoveFeatureAction>({
      type: types.REMOVE_FEATURE,
      payload: { focusedmap, featureId },
    });
  }
};

export const setCurrentFeatureLayer = (currentFeatureLayer: string) => (
  dispatch: Dispatch
) => {
  const focusedmap = API.map.getFocusedMapUUID();
  dispatch<SetCurrentFeatureLayerAction>({
    type: types.SET_CURRENT_FEATURE_LAYER,
    payload: { currentFeatureLayer, focusedmap },
  });
};
export const setContextMenu = (
  source: string,
  featureID: string,
  menu: any
) => (dispatch: Dispatch) => {
  const focusedmap = API.map.getFocusedMapUUID();
  dispatch<SetContextMenuAction>({
    type: types.SET_CONTEXT_MENU,
    payload: { source, featureID, menu, focusedmap },
  });
};

export const setSelectionForLayers = (arrayOfLayerId: string[]) => (
  dispatch: Dispatch
) => {
  const focusedmap = API.map.getFocusedMapUUID();
  dispatch<SetSelectionForLayersAction>({
    type: types.SET_SPATIAL_LAYER_SELECTION,
    payload: { arrayOfLayerId, focusedmap },
  });
};
