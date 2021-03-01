import { ActionTypes as layersActionsTypes, LayersActions } from "./layers";
import { ActionTypes as featureActionsTypes, FeatureActions } from "./features";
import {
  ActionTypes as interactionsActionsTypes,
  InteractionActions,
} from "./interactions";
import { ActionTypes as mapActionsTypes, MapActions } from "./map";
import { ActionTypes as overlaysActionsTypes, OverlayActions } from "./overlay";
import rasterActionsTypes from "./raster";
import toolsActionsTypes from "./tools";
import uiActionsTypes from "./ui";

const actionTypes = {
  ...layersActionsTypes,
  ...featureActionsTypes,
  ...interactionsActionsTypes,
  ...mapActionsTypes,
  ...overlaysActionsTypes,
  ...rasterActionsTypes,
  ...toolsActionsTypes,
  ...uiActionsTypes,
};

export type Actions =
  | FeatureActions
  | InteractionActions
  | MapActions
  | OverlayActions
  | LayersActions;

export default actionTypes;
