import { View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { ScaleLine, ZoomSlider, MousePosition, OverviewMap, FullScreen, defaults as DefaultControls } from "ol/control";
import OSM from "ol/source/OSM";
import config from "react-global-configuration";
import NessMapping from "../../nessMapping/mapping";

import types from "./actionsTypes";

export const InitMap = () => (dispatch, getState) => {
    const {
        proj,
        center,
        zoom,
    } = config.get("MapConfig");

    const uuid = NessMapping.getInstance().addMapProxy({
        //  Display the map in the div with the id of map
        // Render the tile layers in a map view with a Mercator projection
        view: new View({
            projection: proj,
            center: center,
            zoom: zoom,
        }),
    });

    const uuidFocused = getState().map.focused
    if (uuidFocused) {
        NessMapping.getInstance().getMapProxy(uuidFocused)._olmap.unset('target')
    }
    if (uuid) {
        dispatch({
            type: types.INIT_MAP,
            payload: uuid,
        });
    }


}

export const setMapFocus = (uuid) => (dispatch, getState) => {
    const uuidFocused = getState().map.focused
    if (uuidFocused) {
        NessMapping.getInstance().getMapProxy(uuidFocused)._olmap.unset('target')
    }
    dispatch({
        type: types.SET_MAP_FOCUSED,
        payload: uuid,
    });
}
