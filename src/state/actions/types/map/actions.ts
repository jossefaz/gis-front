import { ActionTypes } from "./actionsTypes";

export interface InitMapAction {
  type: ActionTypes.INIT_MAP;
  payload: string;
}

export interface SetMapFocusAction {
  type: ActionTypes.SET_MAP_FOCUSED;
  payload: string;
}
