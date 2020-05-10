import types from "./actionsTypes";
import { addOverlay, getFocusedMapProxy, removeOverlay } from '../../nessMapping/api'

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

export const unsetOverlay = (config) => (dispatch) => {
    removeOverlay(config.uuid)
    dispatch({
        type: types.UNSET_OVERLAY,
        payload: config
    })
}

export const unsetOverlays = (config) => (dispatch) => {
    Object.keys(config.overlays).map(overlay => removeOverlay(overlay))
    dispatch({
        type: types.UNSET_OVERLAYS,
        payload: config
    })
}



const _setUUIDtoOverlay = (prevSelector, nextSelector) => {
    const overlayDiv = document.querySelector(`#${prevSelector}`)
    overlayDiv.setAttribute("id", `${nextSelector}`)
}