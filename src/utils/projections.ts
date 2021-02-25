import Projection from "ol/proj/Projection";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { SupportedProjections } from "../core/types/projections";
import { Coordinate } from "ol/coordinate";
proj4.defs(
  "EPSG:2039",
  "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs"
);
register(proj4);

export const projIsrael = new Projection({
  code: SupportedProjections.ISRAEL,
  extent: [119090.66, 374048.52, 264683.75, 798367.27],
});

export const convertCoordToIsraelTM = (
  sourceSR: SupportedProjections,
  coord: Coordinate
) => {
  let point = { x: coord[0], y: coord[1] };
  if (sourceSR != SupportedProjections.ISRAEL) {
    var source = proj4.Proj(sourceSR);
    var dest = proj4.Proj(SupportedProjections.ISRAEL);
    point = proj4.transform(source, dest, point);
  }
  return [point.x, point.y];
};
