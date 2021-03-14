import { OSM, XYZ } from "ol/source";
import TileLayer from "ol/layer/Tile";
import types from "./types";
import API from "../../core/api";
import { Dispatch } from "redux";
import { GisState } from "../stateTypes";
import { InitRasterAction, SetRasterAction } from "./types/raster/actions";
import { RasterItem } from "../../core/types";

export const setRaster = (rasterName: string) => (
  dispatch: Dispatch,
  getState: () => GisState
) => {
  const { Catalog } = getState().Rasters;
  API.map.getFocusedMap().getLayers().setAt(0, Catalog[rasterName].layer);

  dispatch<SetRasterAction>({
    type: types.SET_RASTER,
    payload: rasterName,
  });
};

export const InitRasters = () => (dispatch: Dispatch) => {
  const Rasters: { [rasterName: string]: RasterItem } = {};

  Rasters["osm"] = {
    layer: new TileLayer({
      source: new OSM({
        crossOrigin: "Anonymous",
      }),
    }),
    metadata: {
      name: "Open Street Map",
      alias: "OSM",
      icon: "OSM.png",
    },
  };

  Rasters["viewr"] = {
    layer: new TileLayer({
      source: new XYZ({
        attributions:
          'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
          'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/" +
          "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        crossOrigin: "Anonymous",
      }),
    }),
    metadata: {
      name: "ESRI WorldMap",
      alias: " ESRI מפת רקע",
      icon: "ESRI.png",
    },
  };

  dispatch<InitRasterAction>({
    type: types.INIT_RASTER,
    payload: {
      Catalog: Rasters,
      Focused: "osm",
    },
  });
};
