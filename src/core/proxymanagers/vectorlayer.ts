import API from "../api";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";
import VLProxy from "../proxy/vectorlayers";
import { Feature } from "ol";
import { Extent } from "ol/extent";
import { Coordinate } from "ol/coordinate";
import TileLayer from "ol/layer/Tile";

class VectorLayerProxyManager {
  private static instance: VectorLayerProxyManager;
  private _registry: { [uuid: string]: VLProxy };

  private constructor() {
    this._registry = {};
  }

  public static getInstance(): VectorLayerProxyManager {
    if (!VectorLayerProxyManager.instance) {
      VectorLayerProxyManager.instance = new VectorLayerProxyManager();
    }
    return VectorLayerProxyManager.instance;
  }

  public setNewVectorLayer = (vl: VectorLayer) => {
    const uid = vl.get("__NessUUID__");
    if (!uid) {
      return false;
    }
    this._registry[uid] = new VLProxy(vl);
  };

  public setFromImageLayer = (il: ImageLayer | TileLayer) => {
    const uid = il.get("__NessUUID__");
    if (!uid) {
      return false;
    }
    this._registry[uid] = new VLProxy();
    this._registry[uid].fromImageLayer(il);
  };

  public getVectorLayer = (uid: string) => {
    return this._registry[uid];
  };

  public getFeatureFromNamedLayer = (__NessUUID__: string, fid: string) => {
    let feature = null;
    if (__NessUUID__ in this._registry) {
      feature = this._registry[__NessUUID__].getFeatureById(fid);
    }
    if (feature) {
      return feature;
    }
    return false;
  };

  public getVectorLayersByRefName = (__NessUUID__: string) => {
    return this._registry[__NessUUID__].vectorLayer;
  };

  public getFeaturesByExtent = (extent: Extent) => {
    const features: { [layername: string]: Feature[] } = {};
    debugger;
    Object.values(this._registry).forEach((vl) => {
      if (vl.metadata) {
        features[vl.metadata.restId] = [];
        features[vl.metadata.restId].push(...vl.getFeaturesByExtent(extent));
      }
    });
    return features;
  };

  public getFeaturesAtCoordinate = (coordinates: Coordinate) => {
    const features: Feature[] = [];
    Object.values(this._registry).forEach((vl) => {
      features.push(...vl.getFeaturesAtCoordinate(coordinates));
    });
    return features;
  };

  public removeLayer = (__NessUUID__: string) => {
    if (__NessUUID__ in this._registry) {
      const vl = this._registry[__NessUUID__].vectorLayer;
      this._registry[__NessUUID__].clear();
      if (vl) {
        API.map.getFocusedMap().removeLayer(vl);
      }
      delete this._registry[__NessUUID__];
    }
  };

  public initVectorLayers = (arrayOfLayerNames: string[]) => {
    API.map
      .getFocusedMap()
      .getLayers()
      .getArray()
      .forEach((lyr) => {
        const exists = Boolean(this.getVectorLayer(lyr.get("__NessUUID__")));
        if (
          lyr instanceof ImageLayer &&
          arrayOfLayerNames.includes(lyr.get("__NessUUID__")) &&
          !exists
        ) {
          this.setFromImageLayer(lyr);
        }
        if (
          lyr instanceof VectorLayer &&
          arrayOfLayerNames.includes(lyr.get("__NessUUID__")) &&
          !exists
        ) {
          this.setNewVectorLayer(lyr);
        }
      });
  };

  public getSources = () => {
    return Object.keys(this._registry).map((vlu) => this._registry[vlu].source);
  };
}

export default VectorLayerProxyManager;
