import store from "../redux/store.ts";
import NessMapping from "./proxymanagers/map";
import NessLayer, {
  getLayerObject,
  deleteLayerObject,
  setVisible,
  getVisible,
  setOpacity,
  getOpacity,
} from "./nessLayer";
import NessOverlay from "./overlay";
import NessInteraction from "./interaction";

import Feature from "ol/Feature";
import _ from "lodash";

import NessKeys from "./keys";

/**
 * LAYERS API
 *
 */

// GET Layer
export const getOlLayer = (uuid) => {
  return getLayerObject(uuid, getFocusedMap());
};
// GET OL Layers
export const getOlLayers = () => {
  return getFocusedMap().getLayers().getArray();
};
// GET Ness Layer
export const getNessLayer = (uuid) => {
  return getFocusedMapProxy()._layers.find(
    (layer) => layer.uuid.value === uuid
  );
};
// GET Ness Layers
export const getNessLayers = () => {
  return getFocusedMapProxy()._layers;
};

// SET add layer to map proxy object
export const addLayerToMapProxy = (mdId, alias, lyr, lyrConfig) => {
  const Layer = new NessLayer(mdId, alias, lyr, lyrConfig);
  const MapProxy = getFocusedMapProxy();
  if (MapProxy.AddLayer(Layer)) return Layer;
  return -1;
};

//SET add ness layer to OL map
export const addOlLayerToMap = (uuid, visible = true) => {
  const nessLyr = getNessLayer(uuid);
  if (nessLyr !== -1) {
    const MapProxy = getFocusedMapProxy();
    if (nessLyr.AddSelfToMap(MapProxy)) {
      var olLyr = getOlLayer(uuid);
      if (olLyr && olLyr !== -1) olLyr.setVisible(visible);
      return true;
    } else return false;
  }
  return false;
};

// DELETE
export const removeLayer = (overlay) => {
  return deleteLayerObject(overlay, getFocusedMap());
};

// SET VISIBLE
export const setLayerVisiblity = (uuid, visibilty) => {
  return setVisible(uuid, getFocusedMap(), visibilty);
};

// GET VISIBLE
export const getLayerVisiblity = (uuid) => {
  return getVisible(uuid, getFocusedMap());
};

// export const getVisibleLayers = () => {
//     const state = store.getState();
//     const layers = state.Layers[state.map.focused].layers
//     return Object.keys(layers).map((layerId) => {
//         let lyr = layers[layerId];
//         if (lyr.visible === true)
//             return lyr
//     });
// }

// SET OPACTIY
export const setLayerOpacity = (uuid, opacity) => {
  return setOpacity(uuid, getFocusedMap(), opacity);
};

// GET OPACTIY
export const getLayerOpacity = (uuid) => {
  return getOpacity(uuid, getFocusedMap());
};

const _getmap = (map_uuid) => {
  return map_uuid
    ? NessMapping.getInstance().getMapProxy(map_uuid).OLMap
    : getFocusedMap();
};
