import { ActionTypes } from "./actionsTypes";
import { RasterState } from "../../../stateTypes";

export interface InitRasterAction {
  type: ActionTypes.INIT_RASTER;
  payload: RasterState;
}

export interface SetRasterAction {
  type: ActionTypes.SET_RASTER;
  payload: string;
}
