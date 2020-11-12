/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import GenerateUUID from "../utils/uuid";
import MapProxy from "./mapProxy";
import Overlay from "ol/Overlay";
import NessKeys from "./keys";

export default class NessOverlay {
  constructor(config) {
    this.uuid = { value: GenerateUUID() };
    Object.freeze(this.uuid);
    this.mapIndex = -1;
    this.parent = null;
    this.config = config;
  }
  RefreshMapIndex() {
    this.mapIndex = -1;

    if (this.parent && this.parent.OLMap && this.uuid) {
      this.mapIndex = _getMapIndex(this);
    }

    return this.mapIndex;
  }
  get OLOverlay() {
    return this._OLOverlay;
  }

  AddSelfToMap(parent) {
    var okToAdd = false;
    if (!this.parent && parent instanceof MapProxy && parent.OLMap) {
      this.parent = parent;
      okToAdd = true;
    }

    if (okToAdd) {
      var olOverlay = _toOLOverlay(this);

      if (olOverlay) {
        this.parent.OLMap.addOverlay(olOverlay);
        olOverlay.set(NessKeys.NESS_OVERLAY_UUID_KEY, this.uuid.value, true);
        olOverlay.set(NessKeys.PARENT_UUID, this.parent.uuid.value, true);
        this._OLOverlay = olOverlay;
        return this.uuid.value;
      } else {
        throw "AddOverlay failed - Overlay not created correctly";
      }
    }
  }
  RemoveSelfFromMap() {
    this.parent.OLMap.removeOverlay(this._OLOverlay);
  }
}

////////////////////////////////////////////////////////
// "privates"
////////////////////////////////////////////////////////
const _toOLOverlay = (no) => {
  var newOverlay = new Overlay(no.config);

  if (!newOverlay) {
    throw "Failed creating OL Overlay";
  }
  return newOverlay;
};

const _getMapIndex = (no) => {
  if (no instanceof NessOverlay && no.uuid && no.parent && no.parent.OLMap) {
    const overlays = no.parent.OLMap.getOverlays().getArray();
    return overlays.find(
      (overlay) => overlay.get(NessKeys.NESS_OVERLAY_UUID_KEY) === no.uuid.value
    );
  }

  return -1;
};

export const getOverlayObject = (uuid, OLMap) => {
  if (uuid) {
    const overlays = OLMap.getOverlays().getArray();
    return overlays.find(
      (overlay) => overlay.get(NessKeys.NESS_OVERLAY_UUID_KEY) === uuid
    );
  }
  return -1;
};

export const deleteOverlayObject = (overlay, OLMap) => {
  try {
    OLMap.removeOverlay(overlay);
    return true;
  } catch (error) {
    return -1;
  }
};
