import types from "../actions/actionsTypes";
import produce from "immer";




const interactionsReducer = (state = {}, action) => {
    switch (action.type) {
        case types.SET_INTERACTION:
            return produce(state, (draftState) => {
                const { config, focusedmap } = action.payload
                if (!(config.widgetName in draftState)) {
                    draftState[config.widgetName] = {}
                }
                draftState[config.widgetName][focusedmap] = config
            });
        case types.UNSET_INTERACTION:
            return produce(state, (draftState) => {
                const { uuid, widgetName } = action.payload
                Object.keys(draftState[widgetName]).map(mapId => {
                    if (draftState[widgetName][mapId].uuid == uuid) {
                        delete draftState[widgetName][mapId]
                    }
                })
                if (Object.keys(draftState[widgetName]).length == 0) {
                    delete draftState[widgetName]
                }
            });


        default:
            return state;
    }
};

export default interactionsReducer;
