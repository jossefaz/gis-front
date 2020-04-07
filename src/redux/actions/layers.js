import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import types from "./actionsTypes";

export const addLayer = (layerID) => (dispatch) =>
  dispatch({
    type: types.ADD_LAYER,
    payload: layerID,
  });

export const InitLayers = (layerConfig) => (dispatch) => {
  const AllLayer = {};

  layerConfig.map((lyr) => {
    const newLyr = new ImageLayer({
      source: new ImageWMS({
        params: lyr.params,
        url: lyr.url,
        serverType: lyr.serverType,
      }),
    });
    newLyr.name = lyr.name;
    newLyr.id = lyr.id;
    newLyr.alias = lyr.alias;
    newLyr.setVisible(Boolean(lyr.visible));

    AllLayer[lyr.id] = newLyr;
  });

  dispatch({
    type: types.INIT_LAYERS,
    payload: AllLayer,
  });
};
