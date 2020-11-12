import { getFocusedMap } from "../nessMapping/api";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import styles from "../nessMapping/mapStyle";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { getWFSMetadata } from "./WFS-T";
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
        const sources = this.getSources();
        const features = [];
        sources.map((vs) => {
          // const editable = vs.get("editable"); //TODO : uncomment and change for real editable
          vs.forEachFeatureIntersectingExtent(extent, (feature) => {
            feature.set("editable", true); // TODO : change true value by real editable value
            feature.set("__NessUUID__", vs.get("__NessUUID__"));
            features.push(feature);
          });
        });
        return features;
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
    }
  }

  fromImageLayer = (il) => {
    const source = il.getSource();
    this.uid = il.get("__NessUUID__");
    this.sourceUrl = source.getUrl();
    this.layername = source.getParams().LAYERS;
    this.editable = il.get("editable");
    this._initVectorLayer();
    this._addToMap();
    this._initVectorSource();
  };

  getAttributes = async () => {
    if (this._isValid()) {
      return await getWFSMetadata(this.layername);
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

  refresh = () => {
    this.source.refresh();
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

  highlightAllFeature = () => {
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
