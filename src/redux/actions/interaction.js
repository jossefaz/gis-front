import types from "./actionsTypes";
import { addInteraction, getInteractionProxy, removeInteraction, getFocusedMapProxy } from '../../nessMapping/api'

export const setInteraction = (config) => (dispatch) => {
    const uuid = addInteraction(config);
    if ('sourceLayer' in config) {
        if (config.sourceLayer) {
            config.sourceLayer = config.sourceLayer.get("ol_uid")
        } else {
            const sourceLayer = getInteractionProxy(uuid).OLInteraction.get("__VECTOR_SOURCE__")
            config.sourceLayer = sourceLayer
        }

    }
    config.uuid = uuid

    const focusedmap = getFocusedMapProxy().uuid.value
    dispatch({
        type: types.SET_INTERACTION,
        payload: {
            config,
            focusedmap
        }
    })
}

export const unsetInteraction = (config) => (dispatch) => {
    removeInteraction(config.uuid)
    dispatch({
        type: types.UNSET_INTERACTION,
        payload: config
    })
}
