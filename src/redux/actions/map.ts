import { View } from "ol";
import config from "react-global-configuration";
import MapProxyManager from "../../core/proxymanagers/map";
import API from "../../core/api";
import { projIsrael } from "../../utils/projections";
import { Dispatch } from "redux";
import { GisState } from "../types/state";
import { InitMapAction, SetMapFocusAction } from "../actions/types/map/actions";
import types from "./types";

export const InitMap = () => (dispatch: Dispatch, getState: () => GisState) => {
  const { center, zoom } = config.get("MapConfig");

  const uuid = MapProxyManager.getInstance().addProxy({
    view: new View({
      projection: projIsrael,
      center: center,
      zoom: zoom,
    }),
  });

  const uuidFocused = getState().map.focused;
  if (uuidFocused) {
    API.map.getFocusedMap().unset("target");
  }
  if (uuid) {
    dispatch<InitMapAction>({
      type: types.INIT_MAP,
      payload: uuid,
    });
  }
};

export const setMapFocus = (uuid: string) => (
  dispatch: Dispatch,
  getState: () => GisState
) => {
  const uuidFocused = getState().map.focused;
  if (uuidFocused) {
    API.map.getFocusedMap().unset("target");
  }
  dispatch<SetMapFocusAction>({
    type: types.SET_MAP_FOCUSED,
    payload: uuid,
  });
};
