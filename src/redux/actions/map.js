import {
    View
} from "ol";
import {
    Tile as TileLayer
} from "ol/layer";
import {
    ScaleLine,
    ZoomSlider,
    MousePosition,
    OverviewMap,
    FullScreen,
    defaults as DefaultControls
} from "ol/control";
import OSM from "ol/source/OSM";
import config from "react-global-configuration";
import NessMapping from "../../nessMapping/mapping";
import { getFocusedMap } from "../../nessMapping/api";
import types from "./actionsTypes";
import { projIsrael } from '../../utils/projections'

export const InitMap = () => (dispatch, getState) => {
    const {
        center,
        zoom,
    } = config.get("MapConfig");

    const uuid = NessMapping.getInstance().addMapProxy({
        //  Display the map in the div with the id of map
        // Render the tile layers in a map view with a Mercator projection
        projection: projIsrael,
        view: new View({
            projection: projIsrael,
            center: center,
            zoom: zoom,
        }),
    });

    const uuidFocused = getState().map.focused
    if (uuidFocused) {
        getFocusedMap().unset('target')
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
        getFocusedMap().unset('target')
    }
    dispatch({
        type: types.SET_MAP_FOCUSED,
        payload: uuid,
    });
}