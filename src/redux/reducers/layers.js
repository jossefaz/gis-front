import types from "../actions/actionsTypes";
import produce from "immer";

const initialLayersState = {
  currentLayers : {},
  newLayers : []
};

export default function (state = initialLayersState, action) {
  switch (action.type) {
    case types.SET_LAYER_VISIBLE:
      return produce(state, (draftState) => {
        const visibility = draftState.currentLayers[action.payload].getVisible();
        draftState.currentLayers[action.payload].setVisible(!visibility);
        draftState.currentLayers[action.payload].visible = !visibility;
      });
    case types.SET_LAYER_SELECTABLE:
      return produce(state, (draftState) => {
        const selectable = draftState.currentLayers[action.payload].selectable;
        draftState.currentLayers[action.payload].selectable = !selectable;
      });
    case types.SET_LAYER_OPACITY:
      return produce(state, (draftState) => {
        draftState.currentLayers[action.payload.Id].setOpacity(action.payload.Opacity);
      });
    case types.ADD_LAYER:
      return produce(state, (draftState) => {        
      action.payload.map((lyr) => {
        draftState.currentLayers[lyr.id] = lyr;
      });
      draftState.newLayers = action.payload;
      });     
    case types.INIT_LAYERS:
      return action.payload;
    default:
      return state;
  }
}
