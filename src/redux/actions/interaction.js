import types from "./actionsTypes";
import { addInteraction, getInteractionProxy, removeInteraction, getFocusedMapProxy } from '../../nessMapping/api'

export const setInteraction = (config) => (dispatch) => {
    const uuid = addInteraction(config);
    if ('sourceLayer' in config) {
        if (config.sourceLayer) {
            config.sourceLayer = config.sourceLayer.get("ol_uid")
        } else {
            const ip = getInteractionProxy(uuid)
            config.sourceLayer = ip.sourceLayer.ol_uid
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

