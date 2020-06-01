import { createSelector } from "reselect";

const getLayers = (state) => state.Layers;
const getMapId = (state) => state.map.focused;

// export const selectLayers = createSelector(
//   [getLayers, getMapId],
//   (layersObject, mapId) => {
//     if (layersObject[mapId] && layersObject[mapId]["layerAdded"] === true) {
//       return layersObject[mapId]["layers"];
//     }
//   }
// );

export const selectLayers = createSelector(
  [getLayers, getMapId],
  (layersObject, mapId) => {
    if (layersObject[mapId]) {
      return layersObject[mapId]["layers"];
    } else return null;
  }
);

export const getLayerById = (mapId, layerId) =>
  createSelector(getLayers, (layers) => {
    return layers[mapId][layerId];
  });
