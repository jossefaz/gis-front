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

export interface LayerState {
  [mapUUID: string]: LayerItem;
}
