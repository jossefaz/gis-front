import types from "./actionsTypes";
import NessLayer from "../../nessMapping/nessLayer"
import {
  getFocusedMapProxy,
  getNessLayers,
  getLayer,
  getNessLayer,
  addLayerToMap,
  setLayerVisiblity,
  setLayerOpacity
} from "../../nessMapping/api"
import convertNessLayerToReduxLayer from "../../utils/convertors/layerConverter"


export const addLayers = (arrayOfNessLayers) => (dispatch) => {
  const addedLayers = [];
  const map = getFocusedMapProxy();
  const mapId = map.uuid;
  arrayOfNessLayers.map((lyr) => {
    var nessLyr = new NessLayer(lyr);
    if (nessLyr) {
      if (map.AddLayer(nessLyr, false)) {
        addedLayers.push(convertNessLayerToReduxLayer(nessLyr));
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


export const InitLayers = () => (dispatch) => {
  const allLayersForMap = {};

  //TODO check of cycle stars from redux 
  //or from mapproxy adding layers
  //  layerConfig.map((lyr) => {
  // const newLyr = new NessLayer(
  const nessLayers = getNessLayers();
  const mapId = getFocusedMapProxy().uuid;

  if (nessLayers) {
    nessLayers.map((lyr) => {
      allLayersForMap[lyr.uuid] = convertNessLayerToReduxLayer(lyr);
    });
  };

  dispatch({
    type: types.INIT_LAYERS,
    payload: {
      mapId,
      allLayersForMap
    },
  });
}