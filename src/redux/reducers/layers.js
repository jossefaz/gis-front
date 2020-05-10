import types from "../actions/actionsTypes";
import produce from "immer";

const initialLayersState = {
  Layers: {}
};

export default function (state = initialLayersState, action) {
  switch (action.type) {
    case types.ADD_LAYER:
      return produce(state, (draftState) => {
        action.payload.addedLayers.map((lyr) => {
          draftState.Layers[action.payload.mapId][lyr.uuid] = lyr;
        });
      });

    case types.SET_LAYER_VISIBLE:
      return produce(state, (draftState) => {
        draftState.Layers[action.payload.mapId][action.payload.layerId].visible = action.payload.visible;
      });
    case types.SET_LAYER_OPACITY:
      return produce(state, (draftState) => {
        draftState.Layers[action.payload.mapId][action.payload.layerId].opacity = action.payload.Opacity;
      });
    case types.INIT_LAYERS:
      return produce(state, (draftState) => {
        draftState.Layers[action.payload.mapId] = action.payload.allLayersForMap;
      });
    default:
      return state;
  }
}