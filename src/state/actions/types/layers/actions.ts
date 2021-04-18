import { ActionTypes } from "./actionsTypes";
import { ReduxLayer, LayerStateObject } from "../../../../core/types";
import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";

interface AddLayersActionPayload {
  mapId: string;
  addedLayers: ReduxLayer[];
}

interface AddLayerToOLMapActionPayload {
  mapId: string;
  layerId: string;
  visible: boolean;
}

interface SetMapLayerOpacityActionPayload {
  mapId: string;
  layerId: string;
  Opacity: number;
}

interface InitLayersActionPayload {
  mapId: string;
  layerAdded: boolean;
}

interface InitLayersInternalActionPayload {
  mapId: string;
  layersObject: LayerStateObject;
}

export interface CreateCustomLayerAction {
  type: ActionTypes.CREATE_CUSTOM_LAYER;
  payload: number;
}

export interface AddLayersAction {
  type: ActionTypes.ADD_LAYER;
  payload: AddLayersActionPayload;
}

export interface AddLayerToOLMapAction {
  type: ActionTypes.SET_LAYER_VISIBLE;
  payload: AddLayerToOLMapActionPayload;
}

export interface SetMapLayerVisibleAction {
  type: ActionTypes.SET_LAYER_VISIBLE;
  payload: AddLayerToOLMapActionPayload;
}

export interface SetMapLayerOpacityAction {
  type: ActionTypes.SET_LAYER_OPACITY;
  payload: SetMapLayerOpacityActionPayload;
}

export interface InitLayersAction {
  type: ActionTypes.LAYER_ADDED;
  payload: InitLayersActionPayload;
}

export interface InitLayersInternalAction {
  type: ActionTypes.INIT_LAYERS;
  payload: InitLayersInternalActionPayload;
}
