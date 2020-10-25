import { getArea, getLength } from "ol/sphere";

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */

export const formatLength = (line) => {
  var length = getLength(line, {
    projection: "EPSG:2039",
    radius: 6378137,
  });
  var output;
  if (length > 1000) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};

export const formatRadius = (circle) => {
  var output;
  if (circle > 1000) {
    output = Math.round((circle / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(circle * 100) / 100 + " " + "m";
  }
  return `Radius : ${output}`;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
export const formatArea = (polygon) => {
  var area = getArea(polygon, {
    projection: "EPSG:2039",
    radius: 6378137,
  });
  var output;
  if (area > 100000) {
    output = Math.round((area / 1000) * 100) / 100 + " " + "km2";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m2";
  }
  return output;
};
