import Map from "ol/Map";
import NessKeys from "../keys";
import Overlay from "ol/Overlay";
import OverlayProxyManager from "../proxymanagers/overlay";
import { Options as OverlayOptions } from "ol/Overlay";
import { getFocusedMapProxy } from "./map";
export const getOverlayObject = (uuid: string, OLMap: Map) => {
  if (uuid) {
    const overlays = OLMap.getOverlays().getArray();
    return overlays.find(
      (overlay: Overlay) => overlay.get(NessKeys.NESS_OVERLAY_UUID_KEY) === uuid
    );
  }
  return -1;
};
export const getOverlay = (uuid: string) => {
  const olp = OverlayProxyManager.getInstance().getOverlayProxy(uuid);
  return olp.OLOverlay;
};

export const getOverlayProxy = (uuid: string) => {
  return OverlayProxyManager.getInstance().getOverlayProxy(uuid);
};

export const addOverlay = (config: OverlayOptions) => {
  const OverlayProxy = OverlayProxyManager.getInstance().addOverlayProxy(
    config
  );
  return OverlayProxy.addSelfToMap(getFocusedMapProxy());
};

export const removeOverlay = (uuid: string) => {
  const OverlayProxy = OverlayProxyManager.getInstance().getOverlayProxy(uuid);
  OverlayProxy.RemoveSelfFromMap();
  OverlayProxyManager.getInstance().killOverlayProxy(uuid);
  return true;
};
