import { OSM, TileWMS } from "ol/source";
import TileLayer from "ol/layer/Tile";
import types from "./actionsTypes";

export const InitRasters = () => (dispatch) => {
  const Rasters = {};

  Rasters["osm"] = new TileLayer({
    source: new OSM(),
  });

  Rasters["wms4326"] = new TileLayer({
    source: new TileWMS({
      url: "https://ahocevar.com/geoserver/wms",
      crossOrigin: "",
      params: {
        LAYERS: "ne:NE1_HR_LC_SR_W_DR",
        TILED: true,
      },
      projection: "EPSG:4326",
    }),
  });

  dispatch({
    type: types.INIT_RASTER,
    payload: Rasters,
  });
};
