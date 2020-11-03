import { getFocusedMap, getFeatureProperties } from "../nessMapping/api";
import { geoserverWFSTransaction } from "../utils/features";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
export default (function () {
  let instance;

  function createInstance(layernames) {
    class editLayers {
      refresh(layernames) {
        getFocusedMap()
          .getLayers()
          .getArray()
          .map((lyr) => {
            const ref_name = lyr.get("ref_name");
            if (lyr.get("editable") && layernames.includes(ref_name)) {
              if (lyr instanceof VectorLayer) {
                if (!this[ref_name]) {
                  // TODO : replace url by configuration
                  this[ref_name] = new editLayer(
                    "http://localhost:8080/geoserver/Jeru",
                    ref_name
                  );
                }
                this[ref_name].vectorlayer = lyr;
              }
              if (lyr instanceof ImageLayer) {
                if (!this[ref_name]) {
                  // TODO : replace url by configuration
                  this[ref_name] = new editLayer(
                    "http://localhost:8080/geoserver/Jeru",
                    ref_name
                  );
                }
                this[ref_name].imagelayer = lyr;
              }
            }
          });
      }
    }
    const el = new editLayers();
    el.refresh(layernames);
    return el;
  }

  return {
    getInstance: function (layernames) {
      if (!instance) {
        instance = createInstance(layernames);
      } else {
        layernames && instance.refresh(layernames);
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

  save = async (fid, newProperties) => {
    const feature = this.vectorlayer.getSource().getFeatureById(fid);
    if (feature) {
      const originalProperties = getFeatureProperties(feature);
      Object.keys(originalProperties).map((prop) => {
        if (originalProperties[prop] !== newProperties[prop]) {
          feature.set(prop, newProperties[prop]);
        }
      });
      feature.unset("editable");
      if (!(await this.updateFeature(feature))) {
        feature.set("editable", true);
        Object.keys(originalProperties).map((prop) => {
          feature.set(prop, originalProperties[prop]);
        });
        return false;
      }
      return true;
    }
    console.log(`feature with id ${fid} was not found in its edit proxy`);
    return false;
  };

  refreshLayers = () => {
    this.imagelayer.getSource().updateParams({ TIMESTAMP: Date.now() });
  };

  updateFeature = async (feature) => {
    let success;
    await geoserverWFSTransaction(
      this.baseUrl,
      this.featureType,
      "EPSG:2039",
      "update",
      [feature]
    )
      .then((res) => {
        this.refreshLayers();
        success = true;
      })
      .catch((err) => {
        console.log(err);
        success = false;
      });
    return success;
  };

  isValid = () => {
    return (
      this.baseUrl && this.featureType && this.imagelayer && this.vectorlayer
    );
  };
}
