import types from "../actions/types";
import produce from "immer";
import { AuthState } from "../stateTypes";
import { Actions } from "../actions/types";

const initialState:AuthState = {
jwt: {access_token:null, token_type:"bearer"}
};
const uiReducer = (state: AuthState = initialState, action: Actions): AuthState => {
  switch (action.type) {
    case types.SET_TOKEN:
      return produce(state, (draftState) => {
        draftState.jwt = action.payload;
      });

    default:
      return state;
  }
};

export default uiReducer;
