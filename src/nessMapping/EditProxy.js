import {
  getFocusedMap,
  getFeatureProperties,
  unhighlightFeature,
} from "../nessMapping/api";
import { geoserverWFSTransaction } from "../utils/features";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
import store from "../redux/store";
import { removeFeature, updateFeature } from "../redux/actions/features";
import _ from "lodash";
import styles from "./mapStyle";

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
                if (!this[ref_name].vectorlayer) {
                  this[ref_name].vectorlayer = lyr;
                }
              }
              if (lyr instanceof ImageLayer) {
                if (!this[ref_name]) {
                  // TODO : replace url by configuration
                  this[ref_name] = new editLayer(
                    "http://localhost:8080/geoserver/Jeru",
                    ref_name
                  );
                }
                if (!this[ref_name].imagelayer) {
                  this[ref_name].imagelayer = lyr;
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
  constructor(url, featureType) {
    this.baseUrl = url;
    this.featureType = featureType;
    this.store = {};
    this.currentFeature = null;
  }
  EDIT_KW = "editable";
  UPDATE_KW = "update";
  DELETE_KW = "delete";
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

  set imagelayer(vl) {
    this._imagelayer = vl;
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

  edit = (stateFeature) => {
    this.vectorlayer.getSource().forEachFeature((feature) => {
      if (feature.getId() === stateFeature.id) {
        feature.setStyle(styles.EDIT);
      } else {
        feature.setStyle(styles.HIDDEN);
      }
    });
    this.currentStateFeature = stateFeature;
  };

  getFeatureById = (fid) => {
    return this.vectorlayer.getSource().getFeatureById(fid);
  };

  save = async (newProperties) => {
    const feature = this.getFeatureById(this.currentStateFeature.id);
    if (feature) {
      if (newProperties) {
        this._updatePropertiesOnFeature(feature, newProperties);
      }
      feature.unset(this.EDIT_KW);

      if (!(await this.transaction(feature, this.UPDATE_KW, true))) {
        this._rollBackUpdateProperties(feature);
        feature.set(this.EDIT_KW, true);
        return false;
      }

      if (newProperties) {
        const newFeature = _.cloneDeep(this.currentStateFeature);
        newFeature.properties = _.cloneDeep(newProperties);
        await store.dispatch(
          updateFeature(this.currentStateFeature.id, newFeature)
        );
      }

      feature.set(this.EDIT_KW, true);
      return true;
    }
    console.log(
      `feature with id ${this.currentStateFeature.id} was not found in its edit proxy`
    );
    return false;
  };

  remove = async (fid) => {
    const feature = this.getFeatureById(fid);
    if (feature) {
      if (!(await this.transaction(feature, this.DELETE_KW))) {
        return false;
      }
      await store.dispatch(removeFeature(fid));
      return true;
    }
    console.log(`feature with id ${fid} was not found in its edit proxy`);
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
