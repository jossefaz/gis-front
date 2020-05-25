
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

