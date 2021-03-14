import API from "../api";
import EditProxy from "../proxy/edit";
import VectorLayerRegistry from "../proxymanagers/vectorlayer";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";

class EditProxyManager {
  private static instance: EditProxyManager;
  private _registry: { [uuid: string]: EditProxy };

  private constructor(layernames?: string[]) {
    this._registry = {};
    layernames && this._refresh(layernames);
  }

  public get registry(): { [uuid: string]: EditProxy } {
    return this._registry;
  }

  public removeItem = (__NessUUID__: string) => {
    if (__NessUUID__ in this._registry) {
      this._registry[__NessUUID__].unedit();
      delete this._registry[__NessUUID__];
    }
  };

  public static getInstance(layernames?: string[]): EditProxyManager {
    if (!EditProxyManager.instance) {
      EditProxyManager.instance = layernames
        ? new EditProxyManager(layernames)
        : new EditProxyManager();
    } else {
      layernames &&
        layernames.length > 0 &&
        EditProxyManager.instance._refresh(layernames);
    }
    return EditProxyManager.instance;
  }

  private _refresh = (layernames: string[]) => {
    if (layernames) {
      API.map
        .getFocusedMap()
        .getLayers()
        .getArray()
        .map((lyr) => {
          const lyrid = lyr.get("__NessUUID__");
          lyr.set("editable", true); //TODO : REMOVE AND REPLACE BY REAL LOGIC
          if (lyr.get("editable") && layernames.includes(lyrid)) {
            if (lyr instanceof VectorLayer) {
              if (!this._registry[lyrid]) {
                this._registry[lyrid] = new EditProxy();
              }
              if (!this._registry[lyrid].vectorLayerProxy) {
                const registry = VectorLayerRegistry.getInstance();
                if (!registry.getVectorLayer(lyrid)) {
                  registry.setNewVectorLayer(lyr);
                }
                this._registry[
                  lyrid
                ].vectorLayerProxy = registry.getVectorLayer(lyrid);
              }
            }
            if (lyr instanceof ImageLayer) {
              console.log("this", this);
              if (!this._registry[lyrid]) {
                this._registry[lyrid] = new EditProxy();
              }
              if (!this._registry[lyrid].imagelayer) {
                const registry = VectorLayerRegistry.getInstance();
                if (!registry.getVectorLayer(lyrid)) {
                  registry.setFromImageLayer(lyr);
                }
                this._registry[lyrid].imagelayer = lyr;
              }
            }
          }
        });
    }
  };
}

export default EditProxyManager;
