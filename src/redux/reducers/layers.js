import types from "../actions/actionsTypes";
import produce from "immer";

export default function (state = null, action) {
  switch (action.type) {
    case types.ADD_LAYER:
      return produce(state, (draftState) => {
        const visibility = draftState[action.payload].getVisible();
        draftState[action.payload].setVisible(!visibility);
        draftState[action.payload].visible = !visibility;
      });

    case types.INIT_LAYERS:
      return action.payload;
    default:
      return state;
  }
}
