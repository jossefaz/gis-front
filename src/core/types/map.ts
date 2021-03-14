import Map from "ol/Map";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import LayerProxy from "../proxy/layer";
import InteractionProxy from "../proxy/interaction";
import OverlayProxy from "../proxy/overlay";

export interface IMapProxy {
  uuid: { value: string };
  OLMap: Map;
  getGraphicLayer(ol_id: string | number): VectorLayer;
  setGraphicLayer(
    ol_layer: VectorLayer,
    source_uid: string | null
  ): string | null;
  getVectorSource(ol_id: string | number): VectorSource;
  setVectorSource(ol_vectorSource: VectorSource): string | null;
  setHighLight(): void;
  addLayer(lyrOrId: LayerProxy | number, addToMap: boolean): LayerProxy | false;
  addInteractionProxy(
    interactionProxy: InteractionProxy
  ): InteractionProxy | false;
  addOverlayProxy(overlayProxy: OverlayProxy): OverlayProxy | false;
}

export interface MapState {
  uuids: string[];
  focused: string;
}
