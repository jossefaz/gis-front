import { mainStore as store } from "../../state/store";
import MapProxyManager from "../proxymanagers/map";
import Map from "ol/Map";

export const getFocusedMap = (): Map => getFocusedMapProxy().OLMap;

export const getFocusedMapProxy = () => {
  const state = store.getState();
  return MapProxyManager.getInstance().getProxy(state.map.focused);
};

export const getFocusedMapUUID = () => {
  return getFocusedMapProxy().uuid.value;
};

export const getCurrentResolution = () => {
  return getFocusedMap().getView().getResolution();
};

export const getCurrentExtent = () => {
  return getFocusedMap().getView().calculateExtent();
};

export const getCurrentProjection = () => {
  return getFocusedMap().getView().getProjection();
};

export const zoomIn = () => {
  const currentZoom = getFocusedMap().getView().getZoom();
  currentZoom &&
    getFocusedMap()
      .getView()
      .setZoom(currentZoom + 0.3);
};

export const zoomOut = () => {
  const currentZoom = getFocusedMap().getView().getZoom();
  currentZoom &&
    getFocusedMap()
      .getView()
      .setZoom(currentZoom - 0.3);
};
