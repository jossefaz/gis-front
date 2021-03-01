/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import { GenerateUUID } from "../../utils/uuid";
import MapProxy from "./map";
import Overlay from "ol/Overlay";
import { Options as OverlayOptions } from "ol/Overlay";
import NessKeys from "../keys";

export default class NessOverlay {
  public uuid: { value: string };
  private _parentMap: MapProxy | null;
  private _olOverlay: Overlay | null;
  private _config: OverlayOptions;

  constructor(config: OverlayOptions) {
    this.uuid = Object.freeze({
      value: GenerateUUID(),
    });

    this._parentMap = null;
    this._config = config;
    this._olOverlay = null;
  }

  get OLOverlay() {
    return this._olOverlay;
  }

  get parentMap() {
    return this._parentMap ? this._parentMap : null;
  }

  private _toOLOverlay = () => {
    const newOverlay = new Overlay(this._config);
    if (!newOverlay) {
      throw "Failed creating OL Overlay";
    }
    return newOverlay;
  };

  public addSelfToMap(parent: MapProxy) {
    if (!this.parentMap) {
      this._parentMap = parent;
    }
    if (this.parentMap) {
      const olOverlay = this._toOLOverlay();
      if (olOverlay) {
        this.parentMap.OLMap.addOverlay(olOverlay);
        olOverlay.set(NessKeys.NESS_OVERLAY_UUID_KEY, this.uuid.value, true);
        olOverlay.set(NessKeys.PARENT_UUID, this.parentMap.uuid.value, true);
        this._olOverlay = olOverlay;
        return this.uuid.value;
      } else {
        throw "AddOverlay failed - Overlay not created correctly";
      }
    }
  }
  public RemoveSelfFromMap() {
    this.parentMap &&
      this.OLOverlay &&
      this.parentMap.OLMap.removeOverlay(this.OLOverlay);
  }
}
