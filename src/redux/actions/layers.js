import types from "./actionsTypes";
import NessLayer from "../../nessMapping/nessLayer"
import {
  getFocusedMapProxy,
  getNessLayers,
  getNessLayer,
  addLayerToMap,
  addLayerToMapProxy,
  setLayerVisiblity,
  setLayerOpacity
} from "../../nessMapping/api"
import {
  nessLayerToReduxLayer
}
from "../../utils/convertors/layerConverter"


export const addLayers = (arrayOfNessLayers) => (dispatch) => {
  const addedLayers = [];
  const map = getFocusedMapProxy();
  const mapId = map.uuid;
  arrayOfNessLayers.map((lyr) => {
    var nessLyr = new NessLayer(lyr);
    if (nessLyr) {
      if (map.AddLayer(nessLyr, false)) {
        addedLayers.push(nessLayerToReduxLayer(nessLyr));
      }
    }
  });

  dispatch({
    type: types.ADD_LAYER,
    payload: {
      mapId,
      addedLayers
    }
  });
}


export const addLayerToOLMap = (layerId, visible) => (dispatch) => {
  const mapId = getFocusedMapProxy().uuid;
  var layerExists = false;
  if (getNessLayer(layerId)) {
    if (addLayerToMap(layerId, visible)) {
      if (layerExists)
        dispatch({
          type: types.SET_LAYER_VISIBLE,
          payload: {
            mapId,
            layerId,
            visible
          }
        });
    }
  }
}

export const setMapLayerVisible = (layerId, visible) => (dispatch) => {
  const mapId = getFocusedMapProxy().uuid;

  if (setLayerVisiblity(layerId, visible)) {
    dispatch({
      type: types.SET_LAYER_VISIBLE,
      payload: {
        mapId,
        layerId,
        visible
      },
    });
  }
}

export const setMapLayerOpacity = (layerId, Opacity) => (dispatch) => {

  const mapId = getFocusedMapProxy().uuid;

  if (setLayerOpacity(layerId, Opacity)) {

    dispatch({
      type: types.SET_LAYER_OPACITY,
      payload: {
        mapId,
        layerId,
        Opacity
      },
    });
  }
}

export const InitLayers = (layersConfig) => (dispatch) => {
  var allLayersForMap = {};
  const mapId = getFocusedMapProxy().uuid.value;
  if (layersConfig) {
    layersConfig.map((lyrConfig) => {
      var nessLyr = addLayerToMapProxy(null, null, null, lyrConfig);
      if (nessLyr !== -1)
        allLayersForMap[nessLyr.uuid.value] = nessLayerToReduxLayer(nessLyr);
    });

    dispatch({
      type: types.INIT_LAYERS,
      payload: {
        mapId,
        allLayersForMap
      },
    });
  }
}