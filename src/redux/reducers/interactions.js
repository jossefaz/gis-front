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

        default:
            return state;
    }
};

export default interactionsReducer;
