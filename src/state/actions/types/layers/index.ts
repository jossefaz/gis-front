import {
  AddLayersAction,
  InitLayersAction,
  SetMapLayerOpacityAction,
  AddLayerToOLMapAction,
  InitLayersInternalAction,
  SetMapLayerVisibleAction,
} from "./actions";
export type LayersActions =
  | AddLayersAction
  | InitLayersAction
  | SetMapLayerOpacityAction
  | AddLayerToOLMapAction
  | InitLayersInternalAction
  | SetMapLayerVisibleAction;
export * from "./actionsTypes";
