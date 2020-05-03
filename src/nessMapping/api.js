import store from '../redux/store';
import NessMapping from "./mapping";
import NessLayer, {
    getLayerObject,
    deleteLayerObject
} from './nessLayer';
import NessOverlay, {
    getOverlayObject,
    deleteOverlayObject
} from "./nessOverlay";
import NessInteraction, {
    getInteractionObject,
    deleteInteractionObject
} from "./nessInteraction";



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
 * LAYERS API
 * 
 */

// GET
export const getLayer = (uuid) => {
    return getLayerObject(uuid, getFocusedMap())
}

// SET
export const addLayer = (config) => {
    const Layer = new NessLayer(config)
    return Layer.AddSelfToMap(getFocusedMapProxy())
}

// DELETE
export const removeLayer = (overlay) => {
    return deleteLayerObject(overlay, getFocusedMap())
}

/**
 * Interaction API
 * 
 */
// GET
export const getInteraction = (uuid) => {
    return getInteractionObject(uuid, getFocusedMap())
}
// SET
export const addInteraction = (config) => {
    const Interaction = new NessInteraction(config)
    return Interaction.AddSelfToMap(getFocusedMapProxy())
}
// DELETE
export const removeInteraction = (interaction) => {
    return deleteInteractionObject(interaction, getFocusedMap())
}

/**
 * OVERLAYS API
 * 
 */

// GET
export const getOverlay = (uuid) => {
    return getOverlayObject(uuid, getFocusedMap())
}

// SET
export const addOverlay = (config) => {
    const Overlay = new NessOverlay(config)
    return Overlay.AddSelfToMap(getFocusedMapProxy())
}

// DELETE
export const removeOverlay = (overlay) => {
    return deleteOverlayObject(overlay, getFocusedMap())
}