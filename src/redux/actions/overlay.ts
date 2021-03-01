import types from "./types";
import API from "../../core/api";
import { OverlayMetadata, OverlaysMetadata } from "../../core/types";
import {
  SetOverlayAction,
  SetOverlayPropertyAction,
  UnsetOverlayAction,
  UnsetOverlaysAction,
} from "../actions/types/overlay/actions";
import { Dispatch } from "redux";

export const setOverlay = (config: OverlayMetadata) => (dispatch: Dispatch) => {
  if (config.overlay) {
    const uuid = API.overlays.addOverlay(config.overlay);
    if (uuid && config.selector) {
      config.uuid = uuid;
      _setUUIDtoOverlay(config.selector, `${config.widgetName}${uuid}`);
      config.selector = `${config.widgetName}${uuid}`;
      const focusedmap = API.map.getFocusedMapProxy().uuid.value;
      dispatch<SetOverlayAction>({
        type: types.SET_OVERLAY,
        payload: {
          config,
          focusedmap,
        },
      });
    }
  }
};

export const setOverlayProperty = (config: OverlayMetadata) => (
  dispatch: Dispatch
) => {
  const focusedmap = API.map.getFocusedMapProxy().uuid.value;
  dispatch<SetOverlayPropertyAction>({
    type: types.SET_OVERLAY_PROPERTY,
    payload: {
      config,
      focusedmap,
    },
  });
};

export const unsetOverlay = (config: OverlayMetadata) => (
  dispatch: Dispatch
) => {
  API.overlays.removeOverlay(config.uuid);
  dispatch<UnsetOverlayAction>({
    type: types.UNSET_OVERLAY,
    payload: config,
  });
};

export const unsetOverlays = (config: OverlaysMetadata) => (
  dispatch: Dispatch
) => {
  config.overlays.map((overlayUUID) => API.overlays.removeOverlay(overlayUUID));
  dispatch<UnsetOverlaysAction>({
    type: types.UNSET_OVERLAYS,
    payload: config,
  });
};

const _setUUIDtoOverlay = (prevSelector: string, nextSelector: string) => {
  const overlayDiv = document.querySelector(`#${prevSelector}`);
  overlayDiv && overlayDiv.setAttribute("id", `${nextSelector}`);
};
