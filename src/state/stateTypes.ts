import {
  SelectedFeature,
  Feature,
  InteractionWidgetItem,
  OverlayWidgetItem,
  RasterItem,
  ToolMetadata,
  GroupMetadata,
  LayerStateObject,
  TokenData,
} from "../core/types";

export interface FeatureState {
  [mapUUID: string]: {
    selectedFeatures: SelectedFeature;
    currentLayer: string | null;
    currentFeature: Feature | null;
    spatialSelection?: number[] | string[];
    contextMenus?: {[layername:string]:{[featureId:string]:any}};
  };
}

export interface InteractionState {
  [widgetName: string]: InteractionWidgetItem;
}

export interface LayerState {
  [mapUUID: string]: LayerStateObject;
}

export interface OverlayState {
  [widgetName: string]: OverlayWidgetItem;
}

export interface MapsToolState {
  tools: { [toolId: string]: ToolMetadata };
  displayOrder: string[];
  Groups: { [groupId: string]: GroupMetadata };
  dynamicTools: string[];
  reset: string[];
  unfocus?: string;
  focused: string;
  stickyTool: string;
}

export type ToolState = {
  [name: string]: MapsToolState;
} & {
  blueprint?: {
    tools: { [toolId: string]: ToolMetadata };
    Groups: { [groupId: string]: GroupMetadata };
    displayOrder: string[];
  };
};

export interface RasterState {
  Catalog: { [rasterName: string]: RasterItem };
  Focused: string | null;
}
export interface MapState {
  uuids: string[];
  focused: string;
}
export interface UiState {
  sideNavOpen: boolean;
}

export interface AuthState {
  jwt: TokenData;
}

export interface GisState {
  Layers: LayerState;
  Features: FeatureState;
  Rasters: RasterState;
  map: MapState;
  Tools: ToolState;
  Interactions: InteractionState;
  Overlays: OverlayState;
  ui: UiState;
  auth: AuthState;
  streamingSystems: any;
}
