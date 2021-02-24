import Map from "ol/Map";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { INessLayer } from "./layers";
import { Options as SelectOptions } from "ol/interaction/Select";
import { Options as DragBoxOptions } from "ol/interaction/DragBox";
import { Options as ModifyOptions } from "ol/interaction/Modify";
import { Options as DrawOptions } from "ol/interaction/Draw";
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
  AddLayer(lyrOrId: INessLayer | number, addToMap: boolean): INessLayer;
}

export enum InteractionSupportedTypes {
  DRAW = "Draw",
  SELECT = "Select",
  MODIFY = "Modify",
  DRAGBOX = "DragBox",
}

export interface InteractionOptions {
  Type: InteractionSupportedTypes;
  interactionConfig:
    | SelectOptions
    | DragBoxOptions
    | ModifyOptions
    | DrawOptions;
  uuid?: string;
  status: number;
  sourceLayer?: VectorSource;
  Layer?: VectorLayer;
}
