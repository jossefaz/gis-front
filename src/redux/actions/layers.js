import NessLayer from "../../nessMapping/nessLayer"
import types from "./actionsTypes";

export const addLayers = (arrayOfLayersID) => (dispatch) => {

  dispatch({
    type: types.ADD_LAYER,
    payload: arrayOfLayersID,
  });

}


// export const setLayerVisible = (layerID) => (dispatch) =>
//   dispatch({
//     type: types.SET_LAYER_VISIBLE,
//     payload: layerID,
//   });

// export const setLayerSelectable = (layerID) => (dispatch) =>
//   dispatch({
//     type: types.SET_LAYER_SELECTABLE,
//     payload: layerID,
//   });

// export const setLayerOpacity = (Id, Opacity) => (dispatch) =>
//   dispatch({
//     type: types.SET_LAYER_OPACITY,
//     payload: { Id, Opacity },
//   });

// export const InitLayers = (layerConfig) => (dispatch) => {
//   const AllLayer = {};

//   layerConfig.map((lyr) => {
//     const newLyr = new ImageLayer({
//       source: new ImageWMS({
//         // params: lyr.params,
//         url: lyr.restaddress,
//         // serverType: lyr.serverType,
//       }),
//     });
//     newLyr.name = lyr.restid;
//     newLyr.id = lyr.semanticid;
//     newLyr.alias = lyr.title;
//     newLyr.setVisible(Boolean(false));
//     newLyr.selectable = true //lyr.selectable;
//     AllLayer[lyr.id] = newLyr;
//   });

//   dispatch({
//     type: types.INIT_LAYERS,
//     payload: AllLayer,
//   });
export const InitLayers = (layerConfig) => (dispatch) => {
    const AllLayer = {};

    layerConfig.map((lyr) => {
      const newLyr = new NessLayer(

      )
    });
    //     const newLyr = new ImageLayer({
    //       source: new ImageWMS({
    //         // params: lyr.params,
    //         url: lyr.restaddress,
    //         // serverType: lyr.serverType,
    //       }),
    //     });
    //     newLyr.name = lyr.restid;
    //     newLyr.id = lyr.semanticid;
    //     newLyr.alias = lyr.title;
    //     newLyr.setVisible(Boolean(false));
    //     newLyr.selectable = true //lyr.selectable;
    //     AllLayer[lyr.id] = newLyr;
    //   });

    //   dispatch({
    //     type: types.INIT_LAYERS,
    //     payload: AllLayer,
    //   });