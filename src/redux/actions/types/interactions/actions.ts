import { ActionTypes } from "./actionsTypes"


export interface SetInteractionAction {
    type: ActionTypes.SET_SELECTED_FEATURES;
    payload: SelectedFeature;
}