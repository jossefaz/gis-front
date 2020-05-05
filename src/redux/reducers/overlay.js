import types from "../actions/actionsTypes";
import produce from "immer";

const overlayReducer = (state = {}, action) => {
    switch (action.type) {
        case types.SET_OVERLAY:
            return produce(state, (draftState) => {
                const { config, focusedmap } = action.payload
                if (!(config.widgetName in draftState)) {
                    draftState[config.widgetName] = {}
                }
                if (!(focusedmap in draftState[config.widgetName])) {
                    draftState[config.widgetName][focusedmap] = {}
                    draftState[config.widgetName][focusedmap].overlays = []
                }
                draftState[config.widgetName][focusedmap].overlays.push(config)
                draftState[config.widgetName][focusedmap].focused = config.uuid
            });

        default:
            return state;
    }
};

export default overlayReducer;
