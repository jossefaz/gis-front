import types from "../actions/actionsTypes";
import produce from "immer";

export default function (state = null, action) {
  switch (action.type) {
    case types.SET_LAYER_VISIBLE:
      return produce(state, (draftState) => {
        const visibility = draftState[action.payload].getVisible();
        draftState[action.payload].setVisible(!visibility);
        draftState[action.payload].visible = !visibility;
      });
    case types.SET_LAYER_SELECTABLE:
      return produce(state, (draftState) => {
        const selectable = draftState[action.payload].selectable;
        draftState[action.payload].selectable = !selectable;
      });

    case types.SET_LAYER_OPACITY:
      return produce(state, (draftState) => {
        draftState[action.payload.Id].setOpacity(action.payload.Opacity);
      });

    case types.ADD_LAYER:
      return produce(state, (draftState) => {
        action.payload.map((lyrID) => (draftState[lyrID].addedToMap = true));
      });

    case types.INIT_LAYERS:
      return action.payload;
    default:
      return state;
  }
}
