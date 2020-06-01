import { lazy } from "react";
export default {
  BaseMapGallery: lazy(() => import("./BaseMapGallery")),
  Identify: lazy(() => import("./Identify")),
  MeasureDistance: lazy(() => import("./MeasureDistance")),
  SingleLayerTest: lazy(() => import("./SingleLayerTest")),
  MantiIntersectionLayer: lazy(() => import("./MantiIntersectionLayer")),
  Draw: lazy(() => import("./Draw")),
  Legend: lazy(() => import("./Legend")),
  Coordinates: lazy(() => import("./Coordinates")),
};
