/* eslint-disable no-throw-literal */
import { GenerateUUID } from "../../utils/uuid";
import { getEmptyVectorLayer } from "../api/interaction";
import NessKeys from "../keys";
import { Map } from "ol";
import mapStyle from "../mapStyle";
import { MapOptions } from "ol/PluggableMap";
import { Vector as VectorLayer } from "ol/layer";
import * as controls from "ol/control";
import { Vector as VectorSource } from "ol/source";
import { IMapProxy } from "../types/map";
import LayerProxy from "./layer";
import OverlayProxy from "./overlay";
import InteractionProxy from "./interaction";

export default class MapProxy implements IMapProxy {
  public uuid: { value: string };
  private _layers: LayerProxy[];
  private _overlays: { [proxyUUID: string]: OverlayProxy };
  private _interactions: { [proxyUUID: string]: InteractionProxy };
  private _graphicLayers: { [ol_id: string]: VectorLayer };
  private _vectorSource: { [ol_id: string]: VectorSource };
  private _highlight: { source: string | null; vector: string | null };
  private _olmap: Map;

  constructor(mapConfig: MapOptions) {
    this.uuid = Object.freeze({
      value: GenerateUUID(),
    });
    this._layers = [];
    this._overlays = {};
    this._interactions = {};
    this._graphicLayers = {};
    this._vectorSource = {};
    this._highlight = {
      source: null,
      vector: null,
    };
    mapConfig.layers = []; // ensure we begin with an empty layers array
    mapConfig.controls = controls.defaults({
      attribution: false,
      zoom: false,
    });
    this._olmap = new Map(mapConfig);
  }

  // TODO: consider hiding map completely...
  get OLMap(): Map {
    return this._olmap;
  }

  public get layers(): LayerProxy[] {
    return this._layers;
  }

  public get overlays(): { [proxyUUID: string]: OverlayProxy } {
    return this._overlays;
  }

  public get interactions(): { [proxyUUID: string]: InteractionProxy } {
    return this._interactions;
  }

  public getInteractionProxy(proxyUUID: string): InteractionProxy {
    return this._interactions[proxyUUID];
  }

  public getOverlayProxy(proxyUUID: string): OverlayProxy {
    return this._overlays[proxyUUID];
  }

  public getGraphicLayer(ol_id: string | number): VectorLayer {
    return this._graphicLayers[ol_id];
  }

  public getVectorSource(ol_id: string | number): VectorSource {
    return this._vectorSource[ol_id];
  }

  get Highlight() {
    return this._highlight.vector ? this._highlight : null;
  }

  public setHighLight(): void {
    const { source, vector } = getEmptyVectorLayer(mapStyle.HIGHLIGHT);

    this.setGraphicLayer(vector, (source as any).ol_uid);
    this.setVectorSource(source);
    this._highlight.source = (source as any).ol_uid;
    this._highlight.vector = (vector as any).ol_uid;
    this.OLMap.addLayer(vector);
  }

  public setGraphicLayer(
    ol_layer: VectorLayer,
    source_uid?: string | null
  ): string | null {
    if (source_uid) {
      ol_layer.set(NessKeys.VECTOR_SOURCE, source_uid);
    }
    let ol_uid = String((ol_layer as any).ol_uid);
    if (ol_uid) {
      this._graphicLayers[ol_uid] = ol_layer;
      return ol_uid;
    }
    return null;
  }

  public setVectorSource(ol_vectorSource: VectorSource): string | null {
    const ol_uid = String((ol_vectorSource as any).ol_uid);
    if (ol_uid) {
      this._vectorSource[ol_uid] = ol_vectorSource;
      return ol_uid;
    }
    return null;
  }

  public addLayer(
    lyrOrId: LayerProxy,
    addToMap: boolean = false
  ): LayerProxy | false {
    if (addToMap) {
      if (lyrOrId.addSelfToMap(this)) {
        this._layers.push(lyrOrId);
        return lyrOrId;
      }
    }
    return false;
  }

  public addInteractionProxy(
    interactionProxy: InteractionProxy
  ): InteractionProxy | false {
    if (interactionProxy) {
      this._interactions[interactionProxy.uuid.value] = interactionProxy;
      return interactionProxy;
    }
    return false;
  }
  public addOverlayProxy(overlayProxy: OverlayProxy): OverlayProxy | false {
    if (overlayProxy) {
      this._overlays[overlayProxy.uuid.value] = overlayProxy;
      return overlayProxy;
    }
    return false;
  }

  public removeInteractionProxy(uuid: string): boolean {
    if (uuid in this._interactions) {
      delete this._interactions[uuid];
      return true;
    }
    return false;
  }
  public removeOverlayProxy(uuid: string): boolean {
    if (uuid in this._overlays) {
      delete this._overlays[uuid];
      return true;
    }
    return false;
  }
}
