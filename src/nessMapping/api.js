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
} from "./interaction";
import NessKeys from './keys'

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

// GET Layer
export const getLayer = (uuid) => {
    return getLayerObject(uuid, getFocusedMap())
}
// GET Ness Layer
export const getNessLayer = ((uuid) => {
    return getFocusedMapProxy()._layers.find(layer =>
        layer.get(NessKeys.NESS_OVERLAY_UUID_KEY) === uuid)
});
// GET Ness Layers
export const getNessLayers = ((uuid) => {
    return getFocusedMapProxy()._layers;
});
// GET OL Layers
export const getLayers = () => {
    return getFocusedMap().getLayers().getArray();
}

// SET add layer to map proxy object
export const addLayerToMapProxy = (mdId, alias, lyr, lyrConfig, addToMap) => {
    const Layer = new NessLayer(mdId, alias, lyr, lyrConfig);
    const MapProxy = getFocusedMapProxy();
    if (MapProxy.AddLayer(Layer))
        return Layer;
    return -1;
}

//SET add layer to OL map
export const addLayerToMap = (uuid, visible = true) => {
    const lyr = getLayer(uuid);
    if (lyr !== -1) {
        const MapProxy = getFocusedMapProxy();
        if (lyr.AddSelfToMap(MapProxy))
            lyr.setVisible(visible);
    }
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
export const getInteraction = (uuid) => {
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