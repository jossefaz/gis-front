import Map from "ol/Map";
import NessKeys from "../keys";
import Overlay from "ol/Overlay";
import OverlayProxy from "../proxy/overlay";
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
  const olp = getFocusedMapProxy().getOverlayProxy(uuid);
  return olp.OLOverlay;
};

export const addOverlay = (config: OverlayOptions) => {
  const proxy = new OverlayProxy(config);
  getFocusedMapProxy().addOverlayProxy(proxy);
  if (proxy.addSelfToMap(getFocusedMapProxy())) return proxy.uuid.value;
  return false;
};

export const removeOverlay = (uuid: string) => {
  const OverlayProxy = getFocusedMapProxy().getOverlayProxy(uuid);
  OverlayProxy.RemoveSelfFromMap();
  if (!getFocusedMapProxy().removeOverlayProxy(uuid)) {
    console.warn(`Overlay ${uuid} was not removed from the map proxy`);
  }
  return true;
};
