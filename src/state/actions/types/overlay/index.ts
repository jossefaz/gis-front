import { SetOverlayAction, SetOverlayPropertyAction, UnsetOverlayAction, UnsetOverlaysAction } from "./actions";
export * from "./actionsTypes";

export type OverlayActions = SetOverlayAction | SetOverlayPropertyAction | UnsetOverlayAction | UnsetOverlaysAction;
