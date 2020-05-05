
import types from "../actions/actionsTypes";
import produce, { finishDraft } from "immer";

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
                    draftState[config.widgetName][focusedmap].overlays = {}
                }
                draftState[config.widgetName][focusedmap].overlays[config.uuid] = config
                draftState[config.widgetName][focusedmap].focused = config.uuid
            });

        case types.UNSET_OVERLAY:
            return produce(state, (draftState) => {
                const { uuid, widgetName } = action.payload
                Object.keys(draftState[widgetName]).map(mapId => {
                    draftState[widgetName][mapId].overlays =
                        draftState[widgetName][mapId].overlays.filter(overlay => overlay.uuid !== uuid)
                    if (draftState[widgetName][mapId].overlays.length == 0) {
                        delete draftState[widgetName][mapId]
                    }
                })
                if (Object.keys(draftState[widgetName]).length == 0) {
                    delete draftState[widgetName]
                }
            });
        case types.UNSET_OVERLAYS:
            return produce(state, (draftState) => {
                const { overlays, widgetName } = action.payload

                Object.keys(overlays).map(overlay => {
                    Object.keys(draftState[widgetName]).map(mapId => {
                        if (overlay in draftState[widgetName][mapId].overlays) {
                            delete draftState[widgetName][mapId].overlays[overlay]
                        }
                        if (Object.keys(draftState[widgetName][mapId].overlays).length == 0) {
                            delete draftState[widgetName][mapId]
                        }
                    })

                })

                if (Object.keys(draftState[widgetName]).length == 0) {
                    delete draftState[widgetName]
                }

            });

        default:
            return state;
    }
};

export default overlayReducer;

