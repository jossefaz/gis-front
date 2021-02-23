import {
  SetContextMenuAction,
  RemoveFeatureAction,
  SetSelectionForLayersAction,
  SetCurrentFeatureAction,
  SetCurrentFeatureLayerAction,
  SetSelectedFeaturesAction,
  UpdateFeatureAction,
} from "./actions";
export * from "./actionsTypes";

export type FeatureActions =
  | SetContextMenuAction
  | SetSelectionForLayersAction
  | RemoveFeatureAction
  | SetCurrentFeatureAction
  | SetCurrentFeatureLayerAction
  | SetSelectedFeaturesAction
  | UpdateFeatureAction;
