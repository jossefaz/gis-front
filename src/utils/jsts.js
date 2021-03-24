import * as jsts from "jsts";
import LinearRing from "ol/geom/LinearRing";
import {
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "ol/geom";
export const getBufferedFeature = (olFeature, bufferSize) => {
  const geom = olFeature.getGeometry();
  const parser = new jsts.io.OL3Parser();
  parser.inject(
    Point,
    LineString,
    LinearRing,
    Polygon,
    MultiPoint,
    MultiLineString,
    MultiPolygon
  );
  const jstsGeom = parser.read(geom);
  const buffered = jstsGeom.buffer(bufferSize);
  const finalGeom = parser.write(buffered);
  olFeature.setGeometry(finalGeom);
  return olFeature;
};
