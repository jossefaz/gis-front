
export const getRandomInt = () =>
  Math.floor(Math.random() * Math.floor(999999));
export const isFunction = (Check) => {
  if (Check instanceof Function) {
    return true;
  }
  return false;
};


