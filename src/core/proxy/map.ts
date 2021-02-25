/* eslint-disable no-throw-literal */
import { GenerateUUID } from "../../utils/uuid";
import { getEmptyVectorLayer } from "../api/interaction";
import NessKeys from "../keys";
import { Map } from "ol";
import mapStyle from "../mapStyle";
import { MapOptions } from "ol/PluggableMap";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { IMapProxy } from "../types/map";
import LayerProxy from "./layer";

export default class MapProxy implements IMapProxy {
  public uuid: { value: string };
  private _layers: LayerProxy[];
  private _graphicLayers: { [ol_id: string]: VectorLayer };
  private _vectorSource: { [ol_id: string]: VectorSource };
  private _highlight: { source: string | null; vector: string | null };
  private _olmap: Map;

  constructor(mapConfig: MapOptions) {
    this.uuid = Object.freeze({
      value: GenerateUUID(),
    });
    this._layers = [];
    this._graphicLayers = {};
    this._vectorSource = {};
    this._highlight = {
      source: null,
      vector: null,
    };
    mapConfig.layers = []; // ensure we begin with an empty layers array
    this._olmap = new Map(mapConfig);
  }

  // TODO: consider hiding map completely...
  get OLMap(): Map {
    return this._olmap;
  }

  public get layers(): LayerProxy[] {
    return this._layers;
  }

  getGraphicLayer(ol_id: string | number): VectorLayer {
    return this._graphicLayers[ol_id];
  }

  getVectorSource(ol_id: string | number): VectorSource {
    return this._vectorSource[ol_id];
  }

  get Highlight() {
    return this._highlight.vector ? this._highlight : null;
  }

  setHighLight() {
    const { source, vector } = getEmptyVectorLayer(mapStyle.HIGHLIGHT);
    this.setGraphicLayer(vector, source.get("ol_uid"));
    this.setVectorSource(source);
    this._highlight.source = source.get("ol_uid");
    this._highlight.vector = vector.get("ol_uid");
    this.OLMap.addLayer(vector);
  }

  setGraphicLayer(
    ol_layer: VectorLayer,
    source_uid?: string | null
  ): string | null {
    if (source_uid) {
      ol_layer.set(NessKeys.VECTOR_SOURCE, source_uid);
    }
    let ol_uid = String(ol_layer.get("ol_uid"));
    if (ol_uid) {
      this._graphicLayers[ol_uid] = ol_layer;
      return ol_uid;
    }
    return null;
  }

  setVectorSource(ol_vectorSource: VectorSource): string | null {
    const ol_uid = String(ol_vectorSource.get("ol_uid"));
    if (ol_uid) {
      this._vectorSource[ol_uid] = ol_vectorSource;
      return ol_uid;
    }
    return null;
  }

  AddLayer(lyrOrId: LayerProxy, addToMap: boolean = false): LayerProxy {
    this._layers.push(lyrOrId);
    addToMap && lyrOrId.AddSelfToMap(this);
    return lyrOrId;
  }
}
