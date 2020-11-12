import {
  Image as ImageLayer
} from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";

export const nessLayerToReduxLayer = (nessLayer) => {
  if (nessLayer) {
    const newLayer = {};
    newLayer.name = nessLayer.alias;
    newLayer.semanticId = nessLayer.semanticId;
    newLayer.visible = false;
    newLayer.opacity = 0.5;
    newLayer.uuid = nessLayer.uuid.value;
    newLayer.restid = nessLayer.restid;
    return newLayer;
  }
}

export const convertMdLayerToMapLayer = (mdLayer) => {
  //TODO add all types of layers coming from MD
  const newLyr = new ImageLayer({
    source: new ImageWMS({
      url: mdLayer.restaddress,
    }),
  });
  newLyr.name = mdLayer.restid;
  newLyr.id = mdLayer.semanticid;
  newLyr.alias = mdLayer.title;
  newLyr.setVisible(Boolean(true)); //TODO get info from md 
  newLyr.selectable = mdLayer.selectable; //TODO get info from md 
  return newLyr;
}