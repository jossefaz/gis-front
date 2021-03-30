import {
  formatArea,
  formatLength,
  formatRadius,
} from "../../../../utils/format";
import { LineString, Polygon, Circle } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";

export const generateOutput = (evt) => {
  const geom = evt.target;
  let tooltipCoord;
  let output;
  if (geom instanceof Polygon) {
    output = formatArea(geom);
    tooltipCoord = geom.getInteriorPoint().getCoordinates();
  } else if (geom instanceof LineString) {
    output = formatLength(geom);
    tooltipCoord = geom.getLastCoordinate();
  } else if (geom instanceof Circle) {
    output = formatRadius(geom.getRadius());
    tooltipCoord = geom.getLastCoordinate();
  }
  return { output, tooltipCoord };
};

export const generateNewStyle = (color) => {
  return new Style({
    fill: new Fill({
      color: "rgba(154, 111, 222, 0.2)",
    }),
    stroke: new Stroke({
      color: color,
      width: 2,
    }),
  });
};
