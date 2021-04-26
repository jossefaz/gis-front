import {ActionTypes} from "./actionTypes"

interface InitStreamingActionPayload {
    data: any,
    target: any,
    geoJoinFieldName: any,
}

interface UpdateFeatureAttributesActionPayload {
    data: any,
    target: any,
    messageItemIdFieldName: any,
    symbologyCalculation: any,
}



export interface InitStreamingAction {
    type: ActionTypes.INIT_STREAMING_SYSTEM;
    payload: InitStreamingActionPayload;
}

export interface UpdateFeatureAttributesAction {
    type: ActionTypes.UPDATE_FEATURE_ATTRIBUTES;
    payload: UpdateFeatureAttributesActionPayload;
}

export interface SetUpdatedIdsAction {
    type: ActionTypes.SET_UPDATED_IDS;
    payload: {data:any, target:any};
}