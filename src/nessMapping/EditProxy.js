import { getFocusedMap } from "../nessMapping/api";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
export default (function () {
  let instance;

  function createInstance(layernames) {
    const editLayers = {};

    getFocusedMap()
      .getLayers()
      .getArray()
      .map((lyr) => {
        const ref_name = lyr.get("ref_name");
        if (lyr.get("editable") && layernames.includes(ref_name)) {
          if (lyr instanceof VectorLayer) {
            if (!(ref_name in editLayers)) {
              // TODO : replace ural by configuration
              editLayers[ref_name] = new editLayer(
                "http://localhost:8080/geoserver/Jeru",
                ref_name
              );
            }
            editLayers[ref_name].vectorlayer = lyr;
          }
          if (lyr instanceof ImageLayer) {
            if (!(ref_name in editLayers)) {
              // TODO : replace ural by configuration
              editLayers[ref_name] = new editLayer(
                "http://localhost:8080/geoserver/Jeru",
                ref_name
              );
            }
            editLayers[ref_name].imagelayer = lyr;
          }
        }
      });
    return editLayers;
  }

  return {
    getInstance: function (layernames) {
      if (!instance) {
        instance = createInstance(layernames);
      }
      return instance;
    },
  };
})();

class editLayer {
  constructor(url, featureType) {
    this.baseUrl = url;
    this.featureType = featureType;
    this.store = {};
    this.currentFeature = null;
  }
  get vectorlayer() {
    return this._vectorLayer;
  }

  set vectorlayer(vl) {
    this._vectorLayer = vl;
  }

  get imagelayer() {
    return this._imagelayer;
  }

  set imagelayer(vl) {
    this._imagelayer = vl;
  }

  testit = () => {};
}
