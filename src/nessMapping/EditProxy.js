import {
  getFocusedMap,
  getFeatureProperties,
  unhighlightFeature,
} from "../nessMapping/api";
import { geoserverWFSTransaction, getWFSMetadata } from "../utils/features";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
import store from "../redux/store";
import { removeFeature, updateFeature } from "../redux/actions/features";
import _ from "lodash";
import styles from "./mapStyle";
import convert from "xml-js";

export default (function () {
  let instance;

  function createInstance(layernames) {
    class editLayers {
      refresh(layernames) {
        getFocusedMap()
          .getLayers()
          .getArray()
          .map((lyr) => {
            const __NessUUID__ = lyr.get("__NessUUID__");
            lyr.set("editable", true); //TODO : REMOVE AND REPLACE BY REAL LOGIC
            if (lyr.get("editable") && layernames.includes(__NessUUID__)) {
              if (lyr instanceof VectorLayer) {
                if (!this[__NessUUID__]) {
                  this[__NessUUID__] = new editLayer();
                }
                if (!this[__NessUUID__].vectorlayer) {
                  this[__NessUUID__].vectorlayer = lyr;
                }
              }
              if (lyr instanceof ImageLayer) {
                if (!this[__NessUUID__]) {
                  this[__NessUUID__] = new editLayer();
                }
                if (!this[__NessUUID__].imagelayer) {
                  this[__NessUUID__].imagelayer = lyr;
                }
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
  constructor() {
    this.baseUrl = null;
    this.featureType = null;
    this.currentFeature = null;
  }
  EDIT_KW = "editable";
  UPDATE_KW = "update";
  DELETE_KW = "delete";
  INSERT_KW = "insert";
  get vectorlayer() {
    return this._vectorLayer;
  }

  set vectorlayer(vl) {
    vl.getSource().forEachFeature((feature) => feature.setStyle(styles.HIDDEN));
    vl.setZIndex(99);
    this._vectorLayer = vl;
  }

  get imagelayer() {
    return this._imagelayer;
  }

  set imagelayer(il) {
    if (il instanceof ImageLayer) {
      if (il.getSource().getUrl()) {
        this.baseUrl = il.getSource().getUrl().split("/wms")[0];
        this.featureType = il.getSource().getUrl().split("LAYERS=")[1];
        if (this.featureType.includes("%3A")) {
          this.featureType = this.featureType.split("%3A")[1];
        }
      }
      this._imagelayer = il;
    }
  }

  _updatePropertiesOnFeature = (feature, newProperties) => {
    this.originalProperties = getFeatureProperties(feature);
    Object.keys(this.originalProperties).map((prop) => {
      if (this.originalProperties[prop] !== newProperties[prop]) {
        feature.set(prop, newProperties[prop]);
      }
    });
  };

  _rollBackUpdateProperties = (feature) => {
    Object.keys(this.originalProperties).map((prop) => {
      feature.set(prop, this.originalProperties[prop]);
    });
    this.originalProperties = null;
  };

  edit = (eFeature) => {
    this.vectorlayer.getSource().forEachFeature((feature) => {
      if (feature.getId() === eFeature.getId()) {
        feature.setStyle(styles.EDIT);
      } else {
        feature.setStyle(styles.HIDDEN);
      }
    });
    this.currentFeature = eFeature;
  };

  getFeatureById = (fid) => {
    return this.vectorlayer.getSource().getFeatureById(fid);
  };

  getMetadata = async () => {
    if (this.isValid()) {
      return await getWFSMetadata(this.featureType);
    }
  };

  addFeature = async (feature, properties) => {
    if (feature) {
      Object.keys(properties).map((prop) => {
        feature.set(prop, properties[prop]);
      });
      if (!(await this.transaction(feature, this.INSERT_KW))) {
        return false;
      }
      feature.set(this.EDIT_KW, true);
      return true;
    }
    return false;
  };

  save = async (newProperties) => {
    if (this.currentFeature) {
      if (newProperties) {
        this._updatePropertiesOnFeature(this.currentFeature, newProperties);
      }
      this.currentFeature.unset(this.EDIT_KW);

      if (
        !(await this.transaction(this.currentFeature, this.UPDATE_KW, true))
      ) {
        this._rollBackUpdateProperties(this.currentFeature);
        this.currentFeature.set(this.EDIT_KW, true);
        return false;
      }
      this.currentFeature.set(this.EDIT_KW, true);
      return true;
    }
    console.error(
      `feature with id ${this.currentFeature.getId()} was not found in its edit proxy`
    );
    return false;
  };

  remove = async (fid) => {
    const feature = fid ? this.getFeatureById(fid) : this.currentFeature;
    if (feature) {
      if (!(await this.transaction(feature, this.DELETE_KW))) {
        return false;
      }
      await store.dispatch(removeFeature(fid || this.currentFeature.getId()));
      return true;
    }
    console.error(`feature with id ${fid} was not found in its edit proxy`);
    return false;
  };

  refreshLayers = () => {
    this.imagelayer.getSource().updateParams({ TIMESTAMP: Date.now() });
    this.vectorlayer.getSource().refresh();
    unhighlightFeature();
  };

  transaction = async (feature, transactionType, onlyAlphanum) => {
    let success;
    await geoserverWFSTransaction(
      this.baseUrl,
      this.featureType,
      "EPSG:2039",
      transactionType,
      [feature],
      onlyAlphanum
    )
      .then((res) => {
        this.refreshLayers();
        success = true;
        var xml = convert.xml2js(res.data);
        if (xml.elements[0].name.includes("Exception")) {
          let message = "Error from WFT-T transaction ";
          try {
            let error =
              xml.elements[0].elements[0].elements[0].elements[0].text;
            message = `${message}${error}`;
          } catch (error) {
            // nothing to do here
          }
          console.error(message);
          success = false;
        }
      })
      .catch((err) => {
        console.error(err);
        success = false;
      });
    return success;
  };

  isValid = () => {
    return this.baseUrl && this.featureType && this.vectorlayer;
  };
}
