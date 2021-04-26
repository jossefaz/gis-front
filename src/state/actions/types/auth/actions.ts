import { ActionTypes } from "./actionsTypes";
import { TokenData } from "../../../../core/types";
export interface SetTokenAction {
  type: ActionTypes.SET_TOKEN;
  payload: TokenData;
}

export interface RefreshTokenAction {
  type: ActionTypes.REFRESH_TOKEN;
  payload: string;
}

export interface DestroyTokenAction {
  type: ActionTypes.DESTROY_TOKEN;
}
