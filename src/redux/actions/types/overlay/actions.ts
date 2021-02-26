import { ActionTypes } from "./actionsTypes";
import { OverlayMetadata, OverlaysMetadata } from "../../../types/overlays";
interface SetOverlayActionPayload {
  config: OverlayMetadata;
  focusedmap: string;
}

interface SetOverlayPropertyActionPayload {
  config: OverlayMetadata;
  focusedmap: string;
}

export interface SetOverlayAction {
  type: ActionTypes.SET_OVERLAY;
  payload: SetOverlayActionPayload;
}

export interface SetOverlayPropertyAction {
  type: ActionTypes.SET_OVERLAY_PROPERTY;
  payload: SetOverlayPropertyActionPayload;
}

export interface UnsetOverlayAction {
  type: ActionTypes.UNSET_OVERLAY;
  payload: OverlayMetadata;
}

export interface UnsetOverlaysAction {
  type: ActionTypes.UNSET_OVERLAYS;
  payload: OverlaysMetadata;
}
