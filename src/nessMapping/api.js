import store from '../redux/store';
import NessMapping from "./mapping";
import NessOverlay, { getOverlayObject, deleteOverlayObject } from "./nessOverlay";
import NessInteraction, { getInteractionObject, deleteInteractionObject } from "./nessInteraction";


/**
 * Map API
 * 
 */

//GET
export const getFocusedMap = () => {
    const state = store.getState();
    return NessMapping.getInstance().getMapProxy(state.map.focused).OLMap
}
//GET PROXY OBJECT
export const getFocusedMapProxy = () => {
    const state = store.getState();
    return NessMapping.getInstance().getMapProxy(state.map.focused)
}

/**
 * Interaction API
 * 
 */
// GET
export const getInteraction = (uuid, map_uuid) => {
    return getInteractionObject(uuid, _getmap(map_uuid))
}
// SET
export const addInteraction = (config) => {
    const Interaction = new NessInteraction(config)
    return Interaction.AddSelfToMap(getFocusedMapProxy())
}
// DELETE
export const removeInteraction = (interaction, map_uuid) => {
    return deleteInteractionObject(interaction, _getmap(map_uuid))
}

/**
 * OVERLAYS API
 * 
 */

// GET
export const getOverlay = (uuid, map_uuid) => {
    return getOverlayObject(uuid, _getmap(map_uuid))
}

// SET
export const addOverlay = (config) => {
    const Overlay = new NessOverlay(config)
    return Overlay.AddSelfToMap(getFocusedMapProxy())
}

// DELETE
export const removeOverlay = (overlay, map_uuid) => {
    return deleteOverlayObject(overlay, _getmap(map_uuid))
}

const _getmap = (map_uuid) => {
    return map_uuid ? NessMapping.getInstance().getMapProxy(map_uuid).OLMap : getFocusedMap()
}