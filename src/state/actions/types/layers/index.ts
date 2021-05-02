import {
  AddLayersAction,
  InitLayersAction,
  SetMapLayerOpacityAction,
  AddLayerToOLMapAction,
  InitLayersInternalAction,
  SetMapLayerVisibleAction,
  CreateCustomLayerAction,
} from "./actions";
export type LayersActions =
  | AddLayersAction
  | InitLayersAction
  | SetMapLayerOpacityAction
  | AddLayerToOLMapAction
  | InitLayersInternalAction
  | SetMapLayerVisibleAction
  | CreateCustomLayerAction;
export * from "./actionsTypes";
