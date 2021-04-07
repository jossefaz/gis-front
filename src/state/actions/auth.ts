import types from "./types";
import { Dispatch } from "redux";
import { SetTokenAction } from "./types/auth/actions";
import { TokenData } from "../../core/types";

export const setToken = (token: TokenData) => async (dispatch: Dispatch) => {
  dispatch<SetTokenAction>({
    type: types.SET_TOKEN,
    payload: token,
  });
};
