import types from "../actions/types";
import produce from "immer";
import { LayerState } from "../types/layers";


const reducer = (state: LayerState = {}, action): LayerState => {
  switch (action.type) {
    case types.ADD_LAYER:
      return produce(state, (draftState) => {
        action.payload.addedLayers.map((lyr) => {
          draftState[action.payload.mapId]["layers"][lyr.uuid] = lyr;
        });
      });

    case types.SET_LAYER_VISIBLE:
      return produce(state, (draftState) => {
        draftState[action.payload.mapId]["layers"][
          action.payload.layerId
        ].visible = action.payload.visible;
      });
    case types.SET_LAYER_OPACITY:
      return produce(state, (draftState) => {
        draftState[action.payload.mapId]["layers"][
          action.payload.layerId
        ].opacity = action.payload.Opacity;
      });
    case types.INIT_LAYERS:
      return produce(state, (draftState) => {
        draftState[action.payload.mapId] = action.payload.layersObject;
      });
    case types.LAYER_ADDED:
      return produce(state, (draftState) => {
        draftState[action.payload.mapId]["layerAdded"] =
          action.payload.layerAdded;
      });
    default:
      return state;
  }
}

export const selectVisibleLayers = (state) => {
  const { Layers, map } = state;
  let visibles = false;
  if (map.focused in Layers && Layers[map.focused].layers)
    visibles = Object.keys(Layers[map.focused].layers).filter(
      (id) => Layers[map.focused].layers[id].visible === true
    );
  return visibles;
};

export const selectCurrentMapLayers = (state) => {
  const { Layers, map } = state;
  if (map.focused in Layers) {
    return Layers[map.focused].layers;
  }
  return null;
};
export default reducer