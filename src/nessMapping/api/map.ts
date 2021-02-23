import store from "../../redux/store";
import MapProxyManager from "../proxymanagers/map";
import Map from "ol/Map";

export const getFocusedMap = (): Map => {
  const state = store.getState();
  return MapProxyManager.getInstance().getMapProxy(state.map.focused).OLMap;
};

export const getFocusedMapProxy = () => {
  const state = store.getState();
  return MapProxyManager.getInstance().getMapProxy(state.map.focused);
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
