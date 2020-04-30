import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import types from "./actionsTypes";

export const addLayers = (arrayOfLayersID) => (dispatch) =>

  {

    const map = mapSinglton.getInstance()

    const layers = config.get("layers")


    arrayOfLayersID.map(
      id => map.addLayer(id)
    )

    dispatch({
      type: types.ADD_LAYER,
      payload: arrayOfLayersID,
    });

  }


export const setLayerVisible = (layerID) => (dispatch) =>
  dispatch({
    type: types.SET_LAYER_VISIBLE,
    payload: layerID,
  });

export const setLayerSelectable = (layerID) => (dispatch) =>
  dispatch({
    type: types.SET_LAYER_SELECTABLE,
    payload: layerID,
  });

export const setLayerOpacity = (Id, Opacity) => (dispatch) =>
  dispatch({
    type: types.SET_LAYER_OPACITY,
    payload: { Id, Opacity },
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
    newLyr.selectable = lyr.selectable;
    AllLayer[lyr.id] = newLyr;
  });

  dispatch({
    type: types.INIT_LAYERS,
    payload: AllLayer,
  });
};
