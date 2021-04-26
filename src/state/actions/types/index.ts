import { ActionTypes as layersActionsTypes, LayersActions } from "./layers";
import { ActionTypes as featureActionsTypes, FeatureActions } from "./features";
import {
  ActionTypes as interactionsActionsTypes,
  InteractionActions,
} from "./interactions";
import { ActionTypes as mapActionsTypes, MapActions } from "./map";
import { ActionTypes as overlaysActionsTypes, OverlayActions } from "./overlay";
import { ActionTypes as rasterActionsTypes, RasterActions } from "./raster";
import { ActionTypes as toolsActionsTypes, ToolsActions } from "./tools";
import { ActionTypes as authActionsTypes, AuthActions } from "./auth";
import { ActionTypes as uiActionsTypes, UiActions } from "./ui";
import { ActionTypes as streamActionsTypes, StreamActions } from "./stream";

const actionTypes = {
  ...layersActionsTypes,
  ...featureActionsTypes,
  ...interactionsActionsTypes,
  ...mapActionsTypes,
  ...overlaysActionsTypes,
  ...rasterActionsTypes,
  ...toolsActionsTypes,
  ...uiActionsTypes,
  ...authActionsTypes,
  ...streamActionsTypes
};

export type Actions =
  | FeatureActions
  | InteractionActions
  | MapActions
  | OverlayActions
  | LayersActions
  | ToolsActions
  | RasterActions
  | UiActions
  | AuthActions
  | StreamActions

export default actionTypes;
