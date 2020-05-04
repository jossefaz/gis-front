import types from "../actions/actionsTypes";
import produce from "immer";

const initialLayersState = {
  Layers: {}
};

export default function (state = initialLayersState, action) {
  switch (action.type) {
    case types.SET_LAYER_VISIBLE:
      return produce(state, (draftState) => {
        const visibility = draftState.Layers[action.payload].visible;
        draftState.Layers[action.payload].visible = !visibility;
      });
    case types.SET_LAYER_OPACITY:
      return produce(state, (draftState) => {
        draftState.Layers[action.payload.Id].opacity = action.payload.Opacity;
      });
    case types.ADD_LAYER:
      return produce(state, (draftState) => {
        action.payload.map((lyr) => {
          draftState.Layers[lyr.id] = lyr;
        });
      });
    case types.INIT_LAYERS:
      return action.payload;
    default:
      return state;
  }
}