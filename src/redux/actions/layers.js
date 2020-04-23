import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import types from "./actionsTypes";

export const addLayers = (arrayOfLayers) => (dispatch) =>
  dispatch({
    type: types.ADD_LAYER,
    payload: arrayOfLayers,
  });

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
        // params: lyr.params,
        url: lyr.restaddress,
        // serverType: lyr.serverType,
      }),
    });
    newLyr.name = lyr.restid;
    newLyr.id = lyr.semanticid;
    newLyr.alias = lyr.title;
    newLyr.setVisible(Boolean(false));
    newLyr.selectable = true //lyr.selectable;
    AllLayer[lyr.id] = newLyr;
  });

  dispatch({
    type: types.INIT_LAYERS,
    payload: AllLayer,
  });
};