import { Options as SourceOptions } from "ol/source/ImageWMS";

export enum ELayerTypes {
  OL_ImageLayer = "OL_ImageLayer",
  OL_TileLayer = "OL_TileLayer",
  OL_VectorLayer = "OL_VectorLayer",
  OL_Heatmap = "OL_Heatmap",
  OL_Graticule = "OL_Graticule",
  OL_VectorTileLayer = "OL_VectorTileLayer",
  OL_VectorImageLayer = "OL_VectorImageLayer",
}

export enum ESourceTypes {
  OL_ImageArcGISRest = "OL_ImageArcGISRest",
}

export interface ILayerProxy {
  uuid: string;
  mapIndex: number;
  parent: string;
}

export interface IJsonMDLayer {
  semanticid: string;
  title: string;
  restid: string;
  workspace: string;
  displayexpression: string;
  restaddress: string;
}

export interface IMDLayer {
  semanticId: string;
  alias: string;
  restId: string;
  workspace: string;
  displayExpression: string;
  config: ILayerConfig;
}

export interface ReduxLayer {
  name: string;
  semanticId: string;
  visible: boolean;
  opacity: number;
  uuid: string;
  restid: string;
  workspace: string;
}
export interface LayerStateObject {
  layers: { [layerUUID: string]: ReduxLayer };
  layerAdded: boolean;
}

export interface ILayerConfig {
  layerType: ELayerTypes;
  sourceType?: ESourceTypes;
  sourceOptions: SourceOptions;
}

export interface LayerItem {
  name: string;
  semanticId: number;
  visible: boolean;
  opacity: number;
  uuid: { value: string };
  restid: string;
  workspace: string;
}

export interface LayerStateItem {
  layers: { [uuid: string]: LayerItem };
  layerAdded: boolean;
}
