import store from '../redux/store';
import NessMapping from "./mapping";
import NessLayer, {
    getLayerObject,
    deleteLayerObject,
    setVisible,
    getVisible,
    setOpacity,
    getOpacity
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

// SET VISIBLE
export const setLayerVisiblity = (uuid, visibilty) => {
    return setVisible(uuid, getFocusedMap(), visibilty);
}

// GET VISIBLE
export const getLayerVisiblity = (uuid) => {
    return getVisible(uuid, getFocusedMap());
}

// SET OPACTIY
export const setLayerOpacity = (uuid, opacity) => {
    return setOpacity(uuid, getFocusedMap(), opacity);
}

// GET OPACTIY
export const getLayerOpacity = (uuid) => {
    return getOpacity(uuid, getFocusedMap());
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