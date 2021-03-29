import API from "../api";
import { GeoserverUtil, TransactionMode } from "../../utils/Geoserver";
import { Image as ImageLayer } from "ol/layer";
import { mainStore as store } from "../../state/store";
import { ActionTypes } from "../../state/actions/types/features";
import convert from "xml-js";
import VectorLayerRegistry from "../proxymanagers/vectorlayer";
import VLProxy from "./vectorlayers";
import { EditKeyWords } from "../types/edit";
import Feature from "ol/Feature";
import { ImageWMS } from "ol/source";
import { AxiosResponse } from "axios";

export default class EditLayerProxy {
  private _vectorLayerProxy: VLProxy | undefined;
  private _currentFeature: Feature | undefined | null;
  private _imagelayer: ImageLayer | undefined;
  private _geoserverUtil: GeoserverUtil | undefined;
  private _originalProperties: { [key: string]: any } | undefined | null;

  get vectorLayerProxy() {
    return this._vectorLayerProxy;
  }

  set vectorLayerProxy(vl) {
    this._vectorLayerProxy = vl;
  }

  get imagelayer() {
    return this._imagelayer;
  }

  set imagelayer(il) {
    if (il instanceof ImageLayer) {
      const source = il.getSource() as ImageWMS;
      const url = source.getUrl();
      if (url) {
        const featureType = url.split("LAYERS=")[1];
        if (featureType.includes("%3A")) {
          const workspace = featureType.split("%3A")[0];
          const layername = featureType.split("%3A")[1];
          this._geoserverUtil = new GeoserverUtil(workspace, layername);
        }
      }
      this._imagelayer = il;
    }
  }

  private _updatePropertiesOnFeature = (
    feature: Feature,
    newProperties: { [key: string]: any }
  ) => {
    this._originalProperties = API.features.getFeatureProperties(feature);
    Object.keys(this._originalProperties).forEach((prop) => {
      if (
        this._originalProperties &&
        this._originalProperties[prop] !== newProperties[prop]
      ) {
        feature.set(prop, newProperties[prop]);
      }
    });
  };

  private _rollBackUpdateProperties = (feature: Feature) => {
    this._originalProperties &&
      Object.keys(this._originalProperties).forEach((prop) => {
        this._originalProperties &&
          feature.set(prop, this._originalProperties[prop]);
      });
    this._originalProperties = null;
  };

  public edit = (eFeature: Feature) => {
    const geometry = eFeature.getGeometry();
    if (geometry && geometry.getType() !== "Point") {
      this._vectorLayerProxy &&
        this._vectorLayerProxy.highlightFeature(eFeature);
    }
    this._currentFeature = eFeature;
  };

  public getFeatureById = (fid: string) => {
    return this._vectorLayerProxy && this._vectorLayerProxy.getFeatureById(fid);
  };

  public getMetadata = async () => {
    return (
      this._vectorLayerProxy && (await this._vectorLayerProxy.getAttributes())
    );
  };

  public addFeature = async (
    feature: Feature,
    properties: { [key: string]: any }
  ) => {
    if (feature) {
      Object.keys(properties).forEach((prop) => {
        feature.set(prop, properties[prop]);
      });
      if (!(await this._WFSTransaction(feature, TransactionMode.INSERT))) {
        return false;
      }
      feature.set(EditKeyWords.EDIT, true);
      return true;
    }
    return false;
  };

  public unedit = () => {
    this._currentFeature = null;
    const registry = VectorLayerRegistry.getInstance();
    this._vectorLayerProxy &&
      this._vectorLayerProxy.uuid &&
      registry.removeLayer(this._vectorLayerProxy.uuid);
  };

  public save = async (newProperties?: { [key: string]: any }) => {
    if (this._currentFeature) {
      if (newProperties) {
        this._updatePropertiesOnFeature(this._currentFeature, newProperties);
      }
      this._currentFeature.unset(EditKeyWords.EDIT);
      const xmlResponse = await this._WFSTransaction(
        this._currentFeature,
        TransactionMode.UPDATE
      );
      if (!xmlResponse) {
        if (newProperties) {
          this._rollBackUpdateProperties(this._currentFeature);
        }
        this._currentFeature.set(EditKeyWords.EDIT, true);
        return false;
      }
      if (this._handleWFSResponse(xmlResponse)) {
        this._currentFeature.set(EditKeyWords.EDIT, true);
        return true;
      }
      return false;
    }
    return false;
  };

  public remove = async (fid?: string) => {
    const feature = fid ? this.getFeatureById(fid) : this._currentFeature;
    if (feature) {
      const xmlResponse = await this._WFSTransaction(
        feature,
        TransactionMode.DELETE
      );
      if (!xmlResponse) {
        return false;
      }
      if (!this._handleWFSResponse(xmlResponse)) {
        return false;
      }
      API.features.unhighlightFeature();
      const featureId = fid || feature.getId();
      const focusedmap = API.map.getFocusedMapUUID();
      store.dispatch({
        type: ActionTypes.REMOVE_FEATURE,
        payload: { focusedmap, featureId },
      });
      return true;
    }
    console.error(`feature with id ${fid} was not found in its edit proxy`);
    return false;
  };

  public refreshLayers = () => {
    if (this._imagelayer && this._vectorLayerProxy) {
      const source = this._imagelayer.getSource() as ImageWMS;
      source.updateParams({ TIMESTAMP: Date.now() });
      this._vectorLayerProxy.refresh();
    }
  };

  private _WFSTransaction = async (
    feature: Feature,
    transactionType: TransactionMode
  ) => {
    if (this._geoserverUtil) {
      const response = await this._geoserverUtil.WFSTransaction(
        transactionType,
        [feature]
      );
      return response;
    }
  };

  private _handleWFSResponse(xmlResponse: AxiosResponse) {
    this.refreshLayers();
    let success = true;
    const xml = convert.xml2js(xmlResponse.data);
    if (xml.elements[0].name.includes("Exception")) {
      let message = "Error from WFT-T transaction ";
      try {
        let error = xml.elements[0].elements[0].elements[0].elements[0].text;
        message = `${message}${error}`;
      } catch (error) {
        // nothing to do here
      }
      console.error(message);
      success = false;
    }
    return success;
  }
}
