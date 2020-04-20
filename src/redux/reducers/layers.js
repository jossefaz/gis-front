import types from "../actions/actionsTypes";
import produce from "immer";

const initialLayersState = {
  visibleLayers : {},
  newLayers : []
};

export default function (state = initialLayersState, action) {
  switch (action.type) {
    case types.SET_LAYER_VISIBLE:
      return produce(state, (draftState) => {
        const visibility = draftState.visibleLayers[action.payload].getVisible();
        draftState.visibleLayers[action.payload].setVisible(!visibility);
        draftState.visibleLayers[action.payload].visible = !visibility;
      });
    case types.SET_LAYER_SELECTABLE:
      return produce(state, (draftState) => {
        const selectable = draftState.visibleLayers[action.payload].selectable;
        draftState.visibleLayers[action.payload].selectable = !selectable;
      });
    case types.SET_LAYER_OPACITY:
      return produce(state, (draftState) => {
        draftState.visibleLayers[action.payload.Id].setOpacity(action.payload.Opacity);
      });
    case types.ADD_LAYER:
      return produce(state, (draftState) => {        
      action.payload.map((lyr) => {
        draftState.visibleLayers[lyr.id] = lyr;
      });
      draftState.newLayers = action.payload;
      });     
    case types.INIT_LAYERS:
      return action.payload;
    default:
      return state;
  }
}
