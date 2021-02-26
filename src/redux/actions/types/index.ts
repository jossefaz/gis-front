import layersActionsTypes from "./layers";
import { ActionTypes as FeatureTypeActions, FeatureActions } from "./features";
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
  ...FeatureTypeActions,
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
  | OverlayActions;

export default actionTypes;
