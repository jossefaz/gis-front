import types from "../actions/actionsTypes";
import produce from "immer";

export default function (state = null, action) {
  switch (action.type) {
    case types.ADD_LAYER:
      return produce(state, (draftState) => {
        draftState[action.payload].setVisible(
          !draftState[action.payload].getVisible()
        );
        draftState[action.payload].visible = !draftState[
          action.payload
        ].getVisible();
      });

    case types.INIT_LAYERS:
      return action.payload;
    default:
      return state;
  }
}
