import { OSM, XYZ } from "ol/source";
import TileLayer from "ol/layer/Tile";
import types from "./actionsTypes";

export const setRaster = (rasterName) => (dispatch) =>
  dispatch({
    type: types.SET_RASTER,
    payload: rasterName,
  });

export const InitRasters = () => (dispatch) => {
  const Rasters = {};

  Rasters["osm"] = {
    layer: new TileLayer({
      source: new OSM(),
    }),
    metadata: {
      name: "Open Street Map",
      alias: "OSM",
      icon: "OSM.png",
    },
  };

  Rasters["WorldMap"] = {
    layer: new TileLayer({
      source: new XYZ({
        attributions:
          'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
          'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/" +
          "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      }),
    }),
    metadata: {
      name: "ESRI WorldMap",
      alias: " ESRI מפת רקע",
      icon: "ESRI.png",
    },
  };

  dispatch({
    type: types.INIT_RASTER,
    payload: {
      Rasters,
      Focused: "osm",
    },
  });
};
