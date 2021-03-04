import MapProxy from "../proxy/map";
import { MapOptions } from "ol/PluggableMap";

class MapProxyManager {
  private static instance: MapProxyManager;
  private _mapProxies: { [uuid: string]: MapProxy };

  private constructor() {
    this._mapProxies = {};
  }

  public static getInstance(): MapProxyManager {
    if (!MapProxyManager.instance) {
      MapProxyManager.instance = new MapProxyManager();
    }

    return MapProxyManager.instance;
  }

  public getProxy(uuid: string): MapProxy {
    return this._mapProxies[uuid];
  }

  public addProxy(mapConfig: MapOptions): string {
    const mp = new MapProxy(mapConfig);
    this._mapProxies[mp.uuid.value] = mp;
    return mp.uuid.value;
  }

  public killProxy(uuid: string): boolean {
    if (this._mapProxies.hasOwnProperty(uuid)) {
      delete this._mapProxies[uuid];
      return true;
    }

    return false;
  }
}

export default MapProxyManager;
