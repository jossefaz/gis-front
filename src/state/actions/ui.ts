import types from "./types";
import { Dispatch } from "redux";
import { ToogleSideNavAction } from "./types/ui/actions";
export const toogleSideNav = (open: boolean) => (dispatch: Dispatch) =>
  dispatch<ToogleSideNavAction>({
    type: types.TOGGLE_SIDENAV,
    payload: open,
  });
