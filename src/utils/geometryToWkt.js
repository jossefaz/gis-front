import WKT from "ol/format/WKT";
import { Circle } from "ol/geom";
import { circular } from "ol/geom/Polygon";
export const getWKTFromOlGeom = (olgeom) => {
  const format = new WKT();

  if (olgeom.values_.geometry instanceof Circle) {
    return {};
  }

  return format.writeFeature(olgeom);
};
