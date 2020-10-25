import { lazy } from "react";
export default {
  BaseMapGallery: lazy(() => import("./BaseMapGallery")),
  Identify: lazy(() => import("./Identify")),
  MeasureDistance: lazy(() => import("./MeasureDistance")),
  SingleLayerTest: lazy(() => import("./SingleLayerTest")),
<<<<<<< HEAD
  MantiIntersectionLayer: lazy(() => import("./MantiIntersectionLayer")),
  Draw: lazy(() => import("./Draw")),
  Legend: lazy(() => import("./Legend")),
  Coordinates: lazy(() => import("./Coordinates")),
=======
  MantiIntersectionLayer: lazy(() =>
    import("./MantiIntersectionLayer/index.jsx")
  ),
  Draw: lazy(() => import("./Draw")),
  Legend: lazy(() => import("./Legend")),
  Coordinates: lazy(() => import("./Coordinates")),
  Screenshooter: lazy(() => import("./Screenshooter")),
>>>>>>> upstream/master
};
