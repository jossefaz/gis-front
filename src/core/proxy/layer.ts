/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import { GenerateUUID } from "../../utils/uuid";
import MapProxy from "./map";

import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import { ImageArcGISRest } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";

import {
  IJsonMDLayer,
  IMDLayer,
  ELayerTypes,
  ILayerConfig,
  ReduxLayer,
} from "../types/layers";
import NessKeys from "../keys";
import { StreamingLayer } from "./StreamingLayer";

export default class LayerProxy {
  public uuid: { value: string };
  private _mapIndex: number;
  private _parentMap: MapProxy | null;
  private _config: ILayerConfig;
  private _alias: string;
  private _md: IMDLayer;

  constructor(json: IJsonMDLayer, alias?: string) {
    this.uuid = Object.freeze({
      value: GenerateUUID(),
    });
    this._mapIndex = -1;
    this._parentMap = null;
    // TODO : Check need for the others MD Utils
    this._md = LayerProxy.getMDLayerFromJson(json);
    // must-have layer configuration props
    this._config = this._md.config;
    // LayerList props
    this._alias = alias || this._md.alias;
  }

  public get restid(): string {
    return this._md.restId;
  }

  public get workspace(): string {
    return this._md.workspace;
  }

  public get semanticId(): string {
    return this._md.semanticId;
  }

  public get displayExpression(): string {
    return this._md.displayExpression;
  }

  public get metadata(): IMDLayer {
    return this._md;
  }

  public static getMDLayerFromJson(jsonLayer: IJsonMDLayer): IMDLayer {
    return {
      semanticId: jsonLayer.semanticid,
      alias: jsonLayer.title,
      restId: jsonLayer.restid,
      workspace: jsonLayer.workspace,
      displayExpression: jsonLayer.displayexpression,
      symbologyUrl: jsonLayer.symbologyurl,
      symbologyName: jsonLayer.symbologyname,
      channelRegistrationName: jsonLayer.channelregistrationname,
      symbologyField: jsonLayer.symbologyfield,
      symbologyCalculation: jsonLayer.symbologycalculation,
      geoJoinFieldName: jsonLayer.geojoinfieldname,
      config: {
        layerType: jsonLayer.layertype as ELayerTypes,
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
      semanticId: this._md.semanticId,
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
      case ELayerTypes.OL_TileLayer:
        break;
      case ELayerTypes.OL_ImageLayer:
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
      case ELayerTypes.OL_VectorLayer:
        notImplemented();
        break;
      case ELayerTypes.OL_Heatmap:
        notImplemented();
        break;
      case ELayerTypes.OL_Graticule:
        notImplemented();
        break;
      case ELayerTypes.OL_VectorTileLayer:
        notImplemented();
        break;
      case ELayerTypes.OL_VectorImageLayer:
        notImplemented();
        break;
      case ELayerTypes.OL_StreamningLayer:
        var streamingLayer = new StreamingLayer(null, {
          layerName: this._md.restId,
          url: this._config.sourceOptions.url,
          format: new GeoJSON(),
          geoJoinFieldName: this._md.geoJoinFieldName,
          projection: "EPSG:2039",
          sldUrl: this._md.symbologyUrl,
          sldName: this._md.symbologyName,
          channelRegistrationName: this._md.channelRegistrationName,
          symbologyField: this._md.symbologyField,
          symbologyCalculation: this._md.symbologyCalculation,
        }) as any;

        newLyr = streamingLayer.vl;
        newLyr.alias = this._md.alias;
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
