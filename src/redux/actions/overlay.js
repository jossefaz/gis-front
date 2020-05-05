import types from "./actionsTypes";
import { addOverlay, getFocusedMapProxy } from '../../nessMapping/api'

export const setOverlay = (config) => (dispatch) => {
    const uuid = addOverlay(config.overlay);
    config.uuid = uuid
    config.overlay.element = `${config.widgetName}${uuid}`
    _setUUIDtoOverlay(config.selector, config.overlay.element)
    config.selector = config.overlay.element
    const focusedmap = getFocusedMapProxy().uuid.value
    dispatch({
        type: types.SET_OVERLAY,
        payload: {
            config,
            focusedmap
        }
    })
}

const _setUUIDtoOverlay = (prevSelector, nextSelector) => {
    const overlayDiv = document.querySelector(`#${prevSelector}`)
    overlayDiv.setAttribute("id", `${nextSelector}`)
}