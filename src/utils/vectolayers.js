import { getFocusedMap } from "../nessMapping/api";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import styles from "../nessMapping/mapStyle";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "./projections";
import axios from "axios";

export default (function () {
  let instance;

  function createInstance() {
    class VectorLayersRegistry {
      setNewVectorLayer = (vl) => {
        const uid = vl.get("__NessUUID__");
        if (!uid) {
          return false;
        }
        this[uid] = new VectorLayerUtils(vl);
      };
      setFromImageLayer = (il) => {
        const uid = il.get("__NessUUID__");
        if (!uid) {
          return false;
        }
        this[uid] = new VectorLayerUtils();
        this[uid].fromImageLayer(il);
      };
      getVectorLayer = (uid) => {
        return this[uid];
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

  _addToMap = () => {
    getFocusedMap().addLayer(this.vl);
  };

  _initVectorLayer = () => {
    this.vl = new VectorLayer();
    this.vl.set("__NessUUID__", this.uid);
    this.vl.set("editable", true); //TODO : change this to real editable check
    this.vl.setStyle(styles.HIDDEN);
  };

  _initVectorSource = () => {
    const source = this._newVectorSource();
    source.set("editable", this.editable);
    source.set("__NessUUID__", this.uid);
    this.vl.setSource(source);
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
    const vectorSource = new VectorSource({
      loader: () => {
        axios.get(`${this.sourceUrl}/wfs`, { params }).then((res) => {
          const format = vectorSource.getFormat();
          vectorSource.addFeatures(format.readFeatures(res.data));
        });
      },
      format: new GeoJSON({
        dataProjection: projIsrael,
      }),
      strategy: bboxStrategy,
    });
    return vectorSource;
  };
}
