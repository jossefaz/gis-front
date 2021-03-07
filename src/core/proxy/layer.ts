/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import { GenerateUUID } from "../../utils/uuid";
import MapProxy from "./map";

import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import { ImageArcGISRest } from "ol/source";

import {
  IJsonMDLayer,
  IMDLayer,
  ELayerTypes,
  ILayerConfig,
  ReduxLayer,
} from "../types/layers";
import NessKeys from "../keys";

export default class LayerProxy {
  public uuid: { value: string };
  private _mapIndex: number;
  private _parentMap: MapProxy | null;
  private _restid: string;
  private _workspace: string;
  private _semanticId: string;
  private _displayExpression: string;
  private _config: ILayerConfig;
  private _alias: string;

  constructor(json: IJsonMDLayer, alias?: string) {
    this.uuid = Object.freeze({
      value: GenerateUUID(),
    });
    this._mapIndex = -1;
    this._parentMap = null;
    // TODO : Check need for the others MD Utils
    const nl = LayerProxy.getMDLayerFromJson(json);
    this._restid = nl.restId;
    this._workspace = nl.workspace;
    this._semanticId = nl.semanticId;
    this._displayExpression = nl.displayExpression;
    // must-have layer configuration props
    this._config = nl.config;
    // LayerList props
    this._alias = alias || nl.alias;
  }

  public get restid(): string {
    return this._restid;
  }

  public get workspace(): string {
    return this._workspace;
  }

  public get semanticId(): string {
    return this._semanticId;
  }

  public get displayExpression(): string {
    return this._displayExpression;
  }

  public static getMDLayerFromJson(jsonLayer: IJsonMDLayer): IMDLayer {
    return {
      semanticId: jsonLayer.semanticid,
      alias: jsonLayer.title,
      restId: jsonLayer.restid,
      workspace: jsonLayer.workspace,
      displayExpression: jsonLayer.displayexpression,
      config: {
        layerType: ELayerTypes.OL_ImageLayer,
        sourceOptions: {
          ratio: 1,
          params: {
            LAYERS: jsonLayer.workspace + ":" + jsonLayer.restid,
          },
          url: jsonLayer.restaddress,
        },
      },
    };
  }

  public toReduxLayer = (): ReduxLayer => {
    return {
      name: this._alias,
      semanticId: this._semanticId,
      visible: false,
      opacity: 0.5,
      uuid: this.uuid.value,
      restid: this.restid,
      workspace: this.workspace,
    };
  };

  private _toOLLayer = () => {
    // TODO: init a propper OpenLayers Layer object and return it

    let newLyr = null;
    let newSrc = null;

    const notImplemented = () =>
      console.log(
        `${this._config.layerType} is not implemented yet in the core layer proxy`
      );

    switch (this._config.sourceType) {
      case "OL_ImageArcGISRest":
        newSrc = new ImageArcGISRest(this._config.sourceOptions);
        break;
    }

    switch (this._config.layerType) {
      case "OL_TileLayer":
        break;
      case "OL_ImageLayer":
        newLyr = new ImageLayer({
          source: new ImageWMS({
            url: this._config.sourceOptions.url,
            params: this._config.sourceOptions.params,
            serverType: "geoserver",
            crossOrigin: "Anonymous",
          }),
        });
        newLyr.set("alias", this._alias);
        break;
      case "OL_VectorLayer":
        notImplemented();
        break;
      case "OL_Heatmap":
        notImplemented();
        break;
      case "OL_Graticule":
        notImplemented();
        break;
      case "OL_VectorTileLayer":
        notImplemented();
        break;
      case "OL_VectorImageLayer":
        notImplemented();
        break;
    }

    if (!newLyr) {
      throw "Failed creating OL layer";
    }

    return newLyr;
  };

  private _refreshMapIndex() {
    this._mapIndex = -1;
    if (this._parentMap && this._parentMap.OLMap && this.uuid) {
      this._mapIndex = this._getMapIndex();
    }
    return this._mapIndex;
  }

  public addSelfToMap(parent: MapProxy) {
    let okToAdd = false;
    if (this._parentMap && this._parentMap.OLMap) {
      // we already have an existing parent. check sanity
      this._refreshMapIndex();
      if (this._mapIndex < 0) {
        okToAdd = true;
      } else {
        throw "layer already exists in map";
      }
    } else if (parent instanceof MapProxy && parent.OLMap) {
      this._parentMap = parent;
      this._parentMap.addLayer(this);
      okToAdd = true;
    }
    if (okToAdd) {
      const olLayer = this._toOLLayer();

      if (olLayer && this._parentMap) {
        // add the layer to the map
        this._parentMap.OLMap.addLayer(olLayer);

        // OK, layer is in! set uuid
        olLayer.set(NessKeys.NESS_LAYER_UUID_KEY, this.uuid.value, true);

        // and now refresh mapIndex
        this._refreshMapIndex();

        // TODO: register to removeLayer event on map (just in case...)

        return true;
      } else {
        throw "AddLayer failed - layer not created correctly";
      }
    }
  }
  private _getMapIndex = () => {
    if (this.uuid && this._parentMap && this._parentMap.OLMap) {
      const lyrs = this._parentMap.OLMap.getLayers().getArray();
      for (let i = 0; i < lyrs.length; i++) {
        if (lyrs[i].get(NessKeys.NESS_LAYER_UUID_KEY) === this.uuid.value) {
          return i;
        }
      }
    }
    return -1;
  };
}
