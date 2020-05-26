import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";


export const getRandomInt = () =>
  Math.floor(Math.random() * Math.floor(999999));
export const isFunction = (Check) => {
  if (Check instanceof Function) {
    return true;
  }
  return false;
};
export const random_rgba = () => {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
}

export const generate_rgb = ({ r, g, b }) => {
  return `rgb(${r},${g},${b})`
}


export const generateNewStyle = (fillColor, StrokeColor, width) => {
  return new Style({
    fill: new Fill({
      color: fillColor,
    }),
    stroke: new Stroke({
      color: StrokeColor,
      width: width,
    }),
  })
}
