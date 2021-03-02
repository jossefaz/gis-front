import { ActionTypes } from "./actionsTypes";
import { Feature } from "../../../../core/types";

// PAYLOADS

interface SelectedFeatureActionPayload {
  focusedmap: string;
  featuresByLayers: { [layerid: string]: Feature[] };
}

interface CurrentFeatureActionPayload {
  focusedmap: string;
  currentFeature: Feature;
}

interface UpdateFeatureActionPayload {
  focusedmap: string;
  featureId: string;
  newFeature: Feature;
}

interface ContextMenuActionPayload {
  source: string;
  featureID: string;
  menu: any;
  focusedmap: string;
}

interface CurrentFeatureLayerActionPayload {
  currentFeatureLayer: string;
  focusedmap: string;
}

interface RemoveFeatureActionPayload {
  focusedmap: string;
  featureId: string;
}

interface SelectionForLayerActionPayload {
  arrayOfLayerId: string[];
  focusedmap: string;
}

// ACTION DISPATCH

export interface SetSelectedFeaturesAction {
  type: ActionTypes.SET_SELECTED_FEATURES;
  payload: SelectedFeatureActionPayload;
}

export interface SetCurrentFeatureAction {
  type: ActionTypes.SET_CURRENT_FEATURE;
  payload: CurrentFeatureActionPayload;
}

export interface UpdateFeatureAction {
  type: ActionTypes.UPDATE_FEATURE;
  payload: UpdateFeatureActionPayload;
}

export interface RemoveFeatureAction {
  type: ActionTypes.REMOVE_FEATURE;
  payload: RemoveFeatureActionPayload;
}

export interface SetCurrentFeatureLayerAction {
  type: ActionTypes.SET_CURRENT_FEATURE_LAYER;
  payload: CurrentFeatureLayerActionPayload;
}

export interface SetContextMenuAction {
  type: ActionTypes.SET_CONTEXT_MENU;
  payload: ContextMenuActionPayload;
}

export interface SetSelectionForLayersAction {
  type: ActionTypes.SET_SPATIAL_LAYER_SELECTION;
  payload: SelectionForLayerActionPayload;
}
