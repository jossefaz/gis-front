import types from "./actionsTypes";
import NessLayer from "../../nessMapping/nessLayer";
import {
  getFocusedMapProxy,
  getNessLayer,
  addOlLayerToMap,
  addLayerToMapProxy,
  setLayerVisiblity,
  setLayerOpacity,
} from "../../nessMapping/api";
import { nessLayerToReduxLayer } from "../../utils/convertors/layerConverter";
import { getMetaData } from "../../communication/mdFetcher";

export const addLayers = (arrayOfNessLayers) => (dispatch) => {
  const addedLayers = [];
  const map = getFocusedMapProxy();
  const mapId = map.uuid.value;
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
      addedLayers,
    },
  });
};

export const addLayerToOLMap = (layerId, visible) => (dispatch) => {
  const mapId = getFocusedMapProxy().uuid.value;
  if (getNessLayer(layerId)) {
    if (addOlLayerToMap(layerId, visible)) {
      console.log("action add to layer");
      dispatch({
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

export const setMapLayerVisible = (layerId, visible) => (dispatch) => {
  const mapId = getFocusedMapProxy().uuid.value;

  if (setLayerVisiblity(layerId, visible)) {
    dispatch({
      type: types.SET_LAYER_VISIBLE,
      payload: {
        mapId,
        layerId,
        visible,
      },
    });
  }
};

export const setMapLayerOpacity = (layerId, Opacity) => (dispatch) => {
  const mapId = getFocusedMapProxy().uuid.value;
  if (setLayerOpacity(layerId, Opacity)) {
    layerId = layerId.value;
    dispatch({
      type: types.SET_LAYER_OPACITY,
      payload: {
        mapId,
        layerId,
        Opacity,
      },
    });
  }
};

export const InitLayers = (layersConfig) => async (dispatch) => {
  await _initLayers(dispatch);

  dispatch({
    type: types.LAYER_ADDED,
    payload: {
      mapId: getFocusedMapProxy().uuid.value,
      layerAdded: false,
    },
  });
};

const _initLayers = (dispatch) => {
  return new Promise((resolve, reject) => {
    var allLayersForMap = {};
    var layersObject = {};
    const mapId = getFocusedMapProxy().uuid.value;

    getMetaData("layers").then((layersResult) => {
      layersResult.map((lyrConfig) => {
        var nessLyr = addLayerToMapProxy(null, null, null, lyrConfig);
        if (nessLyr !== -1)
          allLayersForMap[nessLyr.uuid.value] = nessLayerToReduxLayer(nessLyr);
      });

      layersObject["layers"] = allLayersForMap;
      layersObject["layerAdded"] = true;

      dispatch({
        type: types.INIT_LAYERS,
        payload: {
          mapId,
          layersObject,
        },
      });
      resolve();
    });
  });
};

// const _resetLayerAdded = (toolsList, dispatch) => {
//   return new Promise((resolve, reject) => {
//     const mapId = getFocusedMapProxy().uuid.value;
//     dispatch({
//       type: types.RESET_TOOLS,
//       payload: mapId,
//     });
//     resolve();
//   });
// };
