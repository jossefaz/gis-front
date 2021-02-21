import { ActionTypes } from "./actionsTypes"
import { SelectedFeatureActionPayload, CurrentFeatureActionPayload } from "../../../types/feature"


export interface SetSelectedFeaturesAction {
    type: ActionTypes.SET_SELECTED_FEATURES;
    payload: SelectedFeatureActionPayload;
}


export interface SetCurrentFeatureAction {
    type: ActionTypes.SET_CURRENT_FEATURE;
    payload: CurrentFeatureActionPayload;
}
