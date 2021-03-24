import types from "../actions/types";
import produce from "immer";
import { LayerState } from "../stateTypes";
import { Actions } from "../actions/types";
import { GisState } from "../stateTypes";

const reducer = (state: LayerState = {}, action: Actions): LayerState => {
  switch (action.type) {
    case types.ADD_LAYER:
      return produce(state, (draftState) => {
        const { addedLayers, mapId } = action.payload;
        addedLayers.forEach((lyr) => {
          draftState[mapId].layers[lyr.uuid] = lyr;
        });
      });

    case types.SET_LAYER_VISIBLE:
      return produce(state, (draftState) => {
        const { mapId, layerId, visible } = action.payload;
        draftState[mapId].layers[layerId].visible = visible;
      });
    case types.SET_LAYER_OPACITY:
      return produce(state, (draftState) => {
        const { mapId, layerId, Opacity } = action.payload;
        draftState[mapId].layers[layerId].opacity = Opacity;
      });
    case types.INIT_LAYERS:
      return produce(state, (draftState) => {
        const { mapId, layersObject } = action.payload;
        draftState[mapId] = layersObject;
      });
    case types.LAYER_ADDED:
      return produce(state, (draftState) => {
        const { mapId, layerAdded } = action.payload;
        draftState[mapId].layerAdded = layerAdded;
      });
    default:
      return state;
  }
};

export const selectVisibleLayers = (state: GisState): string[] | boolean => {
  const { Layers, map } = state;
  let visibles: string[] = [];
  if (map.focused in Layers && Layers[map.focused].layers)
    visibles = Object.keys(Layers[map.focused].layers).filter(
      (id) => Layers[map.focused].layers[id].visible === true
    );
  return visibles;
};

export const selectCurrentMapLayers = (state: GisState) => {
  const { Layers, map } = state;
  if (map.focused in Layers) {
    return Layers[map.focused].layers;
  }
  return null;
};
export default reducer;
