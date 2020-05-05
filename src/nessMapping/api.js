import store from '../redux/store';
import NessMapping from "./mapping";
import NessLayer, {
    getLayerObject,
    deleteLayerObject
} from './nessLayer';
import NessOverlay from "./overlay";
import NessInteraction from "./interaction";



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
    return NessInteraction.getInstance().getInteractionProxy(uuid).OLInteraction
}
export const getInteractionProxy = (uuid) => {
    return NessInteraction.getInstance().getInteractionProxy(uuid)
}

// SET
export const addInteraction = (config) => {
    const InteractionProxy = NessInteraction.getInstance().addInteractionProxy(config)
    return InteractionProxy.AddSelfToMap(getFocusedMapProxy())
}

// DELETE
export const removeInteraction = (uuid) => {
    const InteractionProxy = NessInteraction.getInstance().getInteractionProxy(uuid)
    InteractionProxy.RemoveSelfFromMap()
    NessInteraction.getInstance().killInteractionProxy(uuid)
    return true
}

/**
 * OVERLAYS API
 * 
 */

// GET
export const getOverlay = (uuid) => {
    const olp = NessOverlay.getInstance().getOverlayProxy(uuid)
    return olp.OLOverlay
}

export const getOverlayProxy = (uuid) => {
    return NessOverlay.getInstance().getOverlayProxy(uuid)
}

// SET
export const addOverlay = (config) => {
    const OverlayProxy = NessOverlay.getInstance().addOverlayProxy(config)
    return OverlayProxy.AddSelfToMap(getFocusedMapProxy())
}

// DELETE
export const removeOverlay = (uuid) => {
    const OverlayProxy = NessOverlay.getInstance().getOverlayProxy(uuid)
    OverlayProxy.RemoveSelfFromMap()
    NessOverlay.getInstance().killOverlayProxy(uuid)
    return true
}

const _getmap = (map_uuid) => {
    return map_uuid ? NessMapping.getInstance().getMapProxy(map_uuid).OLMap : getFocusedMap()
}