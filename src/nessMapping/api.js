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
export const getOlLayer = (uuid) => {
    return getLayerObject(uuid, getFocusedMap())
}
// GET OL Layers
export const getOlLayers = () => {
    return getFocusedMap().getLayers().getArray();
}
// GET Ness Layer
export const getNessLayer = ((uuid) => {
    return getFocusedMapProxy()._layers.find(layer =>
        layer.uuid === uuid)
});
// GET Ness Layers
export const getNessLayers = ((uuid) => {
    return getFocusedMapProxy()._layers;
});

// SET add layer to map proxy object
export const addLayerToMapProxy = (mdId, alias, lyr, lyrConfig) => {
    const Layer = new NessLayer(mdId, alias, lyr, lyrConfig);
    const MapProxy = getFocusedMapProxy();
    if (MapProxy.AddLayer(Layer))
        return Layer;
    return -1;
}

//SET add ness layer to OL map
export const addOlLayerToMap = (uuid, visible = true) => {
    const nessLyr = getNessLayer(uuid);
    if (nessLyr !== -1) {
        const MapProxy = getFocusedMapProxy();
        if (nessLyr.AddSelfToMap(MapProxy)) {
            var olLyr = getOlLayer(uuid)
            if (olLyr && olLyr !== -1)
                olLyr.setVisible(visible);
            return true;
        } else
            return false
    }
    return false;
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