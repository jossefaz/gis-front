import { getFocusedMap } from "../core/api";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import styles from "../nessMapping/mapStyle";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { GeoserverUtil } from "./Geoserver";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "./projections";
import axios from "axios";

export default (function () {
  let instance;

  function createInstance() {
    class VectorLayersRegistry {
      registry = {};
      setNewVectorLayer = (vl) => {
        const uid = vl.get("__NessUUID__");
        if (!uid) {
          return false;
        }
        this.registry[uid] = new VectorLayerUtils(vl);
      };
      setFromImageLayer = (il) => {
        const uid = il.get("__NessUUID__");
        if (!uid) {
          return false;
        }
        this.registry[uid] = new VectorLayerUtils();
        this.registry[uid].fromImageLayer(il);
      };
      getVectorLayer = (uid) => {
        return this.registry[uid];
      };

      getFeatureFromNamedLayer = (__NessUUID__, fid) => {
        let feature = null;
        if (__NessUUID__ in this.registry) {
          feature = this.registry[__NessUUID__].getFeatureById(fid);
        }
        if (feature) {
          return feature;
        }
        return false;
      };

      getVectorLayersByRefName = (__NessUUID__) => {
        return this.registry[__NessUUID__].vl;
      };

      getFeaturesByExtent = (extent) => {
        const features = [];
        Object.values(this.registry).map((vl) => {
          features.push(...vl.getFeaturesByExtent(extent));
        });
        return features;
      };

      getFeaturesAtCoordinate = (coordinates) => {
        const features = [];
        Object.values(this.registry).map((vl) => {
          features.push(...vl.getFeaturesAtCoordinate(coordinates));
        });
        return features;
      };

      removeLayer = (__NessUUID__) => {
        if (__NessUUID__ in this.registry) {
          this.registry[__NessUUID__].source.clear();
          getFocusedMap().removeLayer(this.registry[__NessUUID__].vl);
          delete this.registry[__NessUUID__];
        }
      };

      initVectorLayers = (arrayOfLayerNames) => {
        getFocusedMap()
          .getLayers()
          .getArray()
          .map((lyr) => {
            const exists = Boolean(
              this.getVectorLayer(lyr.get("__NessUUID__"))
            );
            if (
              lyr instanceof ImageLayer &&
              arrayOfLayerNames.includes(lyr.get("__NessUUID__")) &&
              !exists
            ) {
              this.setFromImageLayer(lyr);
            }
          });
      };

      getSources = () => {
        return Object.keys(this.registry).map(
          (vlu) => this.registry[vlu].source
        );
      };
    }
    const el = new VectorLayersRegistry();
    return el;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export class VectorLayerUtils {
  constructor(vl) {
    if (vl) {
      this.vl = vl;
      this.uid = vl.get("__NessUUID__");
      if (this.vl.getSource()) {
        this.source = this.vl.getSource();
      }
    }
    this.data = [];
  }

  fromImageLayer = (il) => {
    const source = il.getSource();
    this.uid = il.get("__NessUUID__");
    this.sourceUrl = source.getUrl();
    this.layername = source.getParams().LAYERS;
    this.editable = il.get("editable");
    this.geoserverUtil = new GeoserverUtil(
      this.layername.split(":")[0],
      this.layername.split(":")[1]
    );
    this._initVectorLayer();
    this._addToMap();
    this._initVectorSource();
  };

  getAttributes = async () => {
    if (this._isValid()) {
      return await this.geoserverUtil.getWFSMetadata();
    }
  };

  _isValid = () => {
    return this.layername && this.uid && this.vl;
  };

  _addToMap = () => {
    getFocusedMap().addLayer(this.vl);
  };

  _initVectorLayer = () => {
    this.vl = new VectorLayer();
    this.vl.set("__NessUUID__", this.uid);
    this.vl.set("editable", true); //TODO : change this to real editable check
    this.vl.setStyle(styles.HIDDEN);
    this.vl.setZIndex(99);
  };

  _initVectorSource = () => {
    this._newVectorSource();
    this.source.set("editable", this.editable);
    this.source.set("__NessUUID__", this.uid);
    this.source.forEachFeature((feature) => feature.setStyle(styles.HIDDEN));
    this.vl.setSource(this.source);
  };

  _toggleVisibility = () => {
    this.vl.setVisible(!this.vl.getVisible());
  };

  _setStyle = (style) => {
    this.vl.setStyle(style);
  };

  getFeaturesByExtent = (extent) => {
    const features = [];
    this.source.forEachFeatureIntersectingExtent(extent, (feature) => {
      feature.set("editable", true); // TODO : change true value by real editable value
      feature.set("__NessUUID__", this.source.get("__NessUUID__"));
      features.push(feature);
    });
    return features;
  };
  getFeaturesAtCoordinate = (coordinates) => {
    let features = this.source.getFeaturesAtCoordinate(coordinates);
    features.forEach((feature) => {
      feature.set("editable", true); // TODO : change true value by real editable value
      feature.set("__NessUUID__", this.source.get("__NessUUID__"));
    });
    debugger;
    return features;
  };

  refresh = () => {
    this.source.refresh();
  };

  getFeaturesData = () => {
    return new Promise((resolve, reject) => {
      if (this.data.length > 0) {
        resolve(this.data);
      } else {
        this.source.on("change", (evt) => {
          const source = evt.target;
          if (source.getState() === "ready") {
            const features = this.vl.getSource().getFeatures();
            this.data = features.map((feature) => feature.getProperties());
            resolve(this.data);
          }
        });
      }
    });
  };

  highlightFeature = (eFeature) => {
    this.source.forEachFeature((feature) => {
      if (feature.getId() === eFeature.getId()) {
        feature.setStyle(styles.EDIT);
      } else {
        feature.setStyle(styles.HIDDEN);
      }
    });
  };

  hideAllFeatures = () => {
    this.source.forEachFeature((feature) => {
      feature.setStyle(styles.HIDDEN);
    });
  };

  highlightAllFeatures = () => {
    this.source.forEachFeature((feature) => {
      feature.setStyle(styles.EDIT);
    });
  };

  getFeatureById = (id) => {
    return this.source.getFeatureById(id);
  };

  _newVectorSource = () => {
    const params = {
      service: "WFS",
      version: "1.3.0",
      request: "GetFeature",
      typeName: this.layername,
      layers: this.layername,
      srsname: "EPSG:2039",
      outputFormat: "application/json",
      height: getFocusedMap().getSize()[1],
    };
    this.source = new VectorSource({
      loader: () => {
        axios.get(`${this.sourceUrl}/wfs`, { params }).then((res) => {
          const format = this.source.getFormat();
          this.source.addFeatures(format.readFeatures(res.data));
        });
      },
      format: new GeoJSON({
        dataProjection: projIsrael,
      }),
      strategy: bboxStrategy,
    });
  };
}
