import BaseLayer from "ol/layer/Base";
import Map from "ol/Map";
import NessKeys from "../keys";
import { getFocusedMap, getFocusedMapProxy } from "./map";
import LayerProxy from "../proxy/layer";
import { IJsonMDLayer } from "../types/layers";

export const getLayerObject = (layerUUID: string, OLMap: Map) => {
  const layers = OLMap.getLayers().getArray();
  return layers.find(
    (layer) => layer.get(NessKeys.NESS_LAYER_UUID_KEY) === layerUUID
  );
};
export const deleteLayerObject = (layer: BaseLayer, OLMap: Map) => {
  try {
    OLMap.removeLayer(layer);
    return true;
  } catch (error) {
    return -1;
  }
};
export const setVisible = (uuid: string, OLMap: Map, visibilty: boolean) => {
  const layer = getLayerObject(uuid, OLMap);
  if (layer instanceof BaseLayer) {
    layer.setVisible(visibilty);
    return true;
  }
  return false;
};

export const getVisible = (uuid: string, OLMap: Map): boolean => {
  const layer = getLayerObject(uuid, OLMap);
  if (layer instanceof BaseLayer) {
    return layer.getVisible();
  }
  return false;
};
export const setOpacity = (
  uuid: string,
  OLMap: Map,
  opacity: number
): boolean => {
  const layer = getLayerObject(uuid, OLMap);
  if (layer instanceof BaseLayer) {
    layer.setOpacity(opacity);
    return true;
  }
  return false;
};
export const getOpacity = (uuid: string, OLMap: Map) => {
  const layer = getLayerObject(uuid, OLMap);
  if (layer instanceof BaseLayer) {
    return layer.getOpacity();
  }
  return -1;
};

export const getOlLayer = (uuid: string) => {
  return getLayerObject(uuid, getFocusedMap());
};
export const getOlLayers = () => {
  return getFocusedMap().getLayers().getArray();
};

export const getNessLayer = (uuid: string) => {
  return getFocusedMapProxy().layers.find((layer) => layer.uuid.value === uuid);
};

export const getNessLayers = () => {
  return getFocusedMapProxy().layers;
};

export const addLayerToMapProxy = (lyrConfig: IJsonMDLayer) => {
  const proxy = new LayerProxy(lyrConfig);
  if (proxy.AddSelfToMap(getFocusedMapProxy())) return proxy;
  return -1;
};

export const addOlLayerToMap = (uuid: string, visible = true) => {
  const nessLyr = getNessLayer(uuid);
  if (nessLyr instanceof LayerProxy) {
    const MapProxy = getFocusedMapProxy();
    if (nessLyr.AddSelfToMap(MapProxy)) {
      var olLyr = getOlLayer(uuid);
      if (olLyr instanceof BaseLayer) olLyr.setVisible(visible);
      return true;
    } else return false;
  }
  return false;
};

export const removeLayer = (layer: BaseLayer) => {
  return deleteLayerObject(layer, getFocusedMap());
};

export const setLayerVisiblity = (uuid: string, visibilty: boolean) => {
  return setVisible(uuid, getFocusedMap(), visibilty);
};

export const getLayerVisiblity = (uuid: string) => {
  return getVisible(uuid, getFocusedMap());
};

export const setLayerOpacity = (uuid: string, opacity: number) => {
  return setOpacity(uuid, getFocusedMap(), opacity);
};

// GET OPACTIY
export const getLayerOpacity = (uuid: string) => {
  return getOpacity(uuid, getFocusedMap());
};
