import types from "./types";
import API from "../../core/api";
import LayerProxy from "../../core/proxy/layer";
import {
  IJsonMDLayer,
  ReduxLayer,
  MetaDataType,
  LayerStateObject,
} from "../../core/types";
import { getMetaData } from "../../core/HTTP/metadata";
import {
  AddLayersAction,
  AddLayerToOLMapAction,
  SetMapLayerOpacityAction,
  SetMapLayerVisibleAction,
  InitLayersAction,
  InitLayersInternalAction,
  CreateCustomLayerAction,
} from "./types/layers/actions";
import { Dispatch } from "redux";
import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import { createLayers } from "../../core/HTTP/usersLayers";

export const addLayers = (arrayOfNessLayers: IJsonMDLayer[]) => (
  dispatch: Dispatch
) => {
  const addedLayers: ReduxLayer[] = [];
  const map = API.map.getFocusedMapProxy();
  const mapId = map.uuid.value;
  arrayOfNessLayers.forEach((lyr) => {
    var nessLyr = new LayerProxy(lyr);
    if (nessLyr) {
      if (map.addLayer(nessLyr, false)) {
        addedLayers.push(nessLyr.toReduxLayer());
      }
    }
  });

  dispatch<AddLayersAction>({
    type: types.ADD_LAYER,
    payload: {
      mapId,
      addedLayers,
    },
  });
};

export const addLayerToOLMap = (layerId: string, visible: boolean) => (
  dispatch: Dispatch
) => {
  const mapId = API.map.getFocusedMapProxy().uuid.value;
  if (API.layers.getNessLayer(layerId)) {
    if (API.layers.addOlLayerToMap(layerId, visible)) {
      dispatch<AddLayerToOLMapAction>({
        type: types.SET_LAYER_VISIBLE,
        payload: {
          mapId,
          layerId,
          visible,
        },
      });
    }
  }
};

export const createCustomLayer = (
  layerName: string,
  isPublic: boolean,
  featureCollection: GeoJSONFeatureCollection
) => async (dispatch: Dispatch) => {
  const layerResponse = await createLayers(
    layerName,
    isPublic,
    featureCollection
  );
  if (layerResponse) {
    dispatch<CreateCustomLayerAction>({
      type: types.CREATE_CUSTOM_LAYER,
      payload: layerResponse,
    });
  }
};

export const setMapLayerVisible = (layerId: string, visible: boolean) => (
  dispatch: Dispatch
) => {
  const mapId = API.map.getFocusedMapProxy().uuid.value;
  if (API.layers.setLayerVisiblity(layerId, visible)) {
    dispatch<SetMapLayerVisibleAction>({
      type: types.SET_LAYER_VISIBLE,
      payload: {
        mapId,
        layerId,
        visible,
      },
    });
  }
};

export const setMapLayerOpacity = (layerId: string, Opacity: number) => (
  dispatch: Dispatch
) => {
  const mapId = API.map.getFocusedMapProxy().uuid.value;
  if (API.layers.setLayerOpacity(layerId, Opacity)) {
    dispatch<SetMapLayerOpacityAction>({
      type: types.SET_LAYER_OPACITY,
      payload: {
        mapId,
        layerId,
        Opacity,
      },
    });
  }
};

export const InitLayers = () => async (dispatch: Dispatch) => {
  await _initLayers(dispatch);
  dispatch<InitLayersAction>({
    type: types.LAYER_ADDED,
    payload: {
      mapId: API.map.getFocusedMapProxy().uuid.value,
      layerAdded: false,
    },
  });
};

const _initLayers = (dispatch: Dispatch) => {
  return new Promise<void>((resolve, reject) => {
    var allLayersForMap: { [layerUUID: string]: ReduxLayer } = {};
    var layersObject: LayerStateObject = {
      layerAdded: false,
      layers: {},
    };
    const mapId = API.map.getFocusedMapProxy().uuid.value;
    getMetaData<IJsonMDLayer[]>(MetaDataType.LAYERS).then((layersResult) => {
      if (layersResult) {
        layersResult.forEach((lyrConfig) => {
          const nessLyr = API.layers.addLayerToMapProxy(lyrConfig);
          if (nessLyr !== -1)
            allLayersForMap[nessLyr.uuid.value] = nessLyr.toReduxLayer();
        });
        layersObject.layerAdded = true;
        layersObject.layers = allLayersForMap;
        dispatch<InitLayersInternalAction>({
          type: types.INIT_LAYERS,
          payload: {
            mapId,
            layersObject,
          },
        });
        resolve();
      }
    });
  });
};
