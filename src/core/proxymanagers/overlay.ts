/* eslint-disable no-undef */
import OverlayProxy from "../proxy/overlay";
import { Options as OverlayOptions } from "ol/Overlay";
class OverlayProxyManager {
  private static instance: OverlayProxyManager;
  private _overlayProxies: { [uuid: string]: OverlayProxy };

  private constructor() {
    this._overlayProxies = {};
  }

  public static getInstance(): OverlayProxyManager {
    if (!OverlayProxyManager.instance) {
      OverlayProxyManager.instance = new OverlayProxyManager();
    }
    return OverlayProxyManager.instance;
  }

  public getOverlayProxy(uuid: string) {
    return this._overlayProxies[uuid];
  }

  public addOverlayProxy(config: OverlayOptions) {
    const proxy = new OverlayProxy(config);
    this._overlayProxies[proxy.uuid.value] = proxy;
    return proxy;
  }

  public killOverlayProxy(uuid: string) {
    if (this._overlayProxies.hasOwnProperty(uuid)) {
      delete this._overlayProxies[uuid];
      return true;
    }

    return false;
  }
}

export default OverlayProxyManager;
