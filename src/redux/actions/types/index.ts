import layersActionsTypes from './layers';
import { ActionTypes as FeatureTypeActions, SetSelectedFeaturesAction } from "./features"
import interactionsActionsTypes from "./interactions/actionsTypes";
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
    ...uiActionsTypes
};


export type Actions = SetSelectedFeaturesAction;



export default actionTypes;