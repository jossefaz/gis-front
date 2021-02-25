import layersActionsTypes from "./layers";
import { ActionTypes as FeatureTypeActions, FeatureActions } from "./features";
import {
  ActionTypes as interactionsActionsTypes,
  InteractionActions,
} from "./interactions";
import mapActionsTypes from "./map";
import overlaysActionsTypes from "./overlays";
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

export type Actions = FeatureActions | InteractionActions;

export default actionTypes;
