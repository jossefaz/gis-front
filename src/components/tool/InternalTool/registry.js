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
  Screenshooter: lazy(() => import("./Screenshooter")),
  MapEditor: lazy(() => import("./MapEditor")),
  TestTableOfFeature: lazy(() => import("./TableOfFeatures/Container")),
  TestSpatialSelect: lazy(() => import("./SpatialSelect/Container")),
};
