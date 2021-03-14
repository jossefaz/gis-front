const { geoserverFeatureToOLGeom, InstanceOfGeometryClass } = require("../api");
const { Point, MultiLineString } = require("ol/geom");
describe("nessmapping API", () => {
  const mockPointConfig = {
    type: "Point",
    coordinates: [31, 32],
  };
  it("geoserverFeatureToOLGeom return a Point Geometry", () => {
    expect(
      geoserverFeatureToOLGeom(mockPointConfig) instanceof Point
    ).toBeTruthy();
  });

  it("InstanceOfGeometryClass should return true with a valid geometry instance ", () => {
    const validGeom = geoserverFeatureToOLGeom(mockPointConfig);
    expect(InstanceOfGeometryClass(validGeom)).toBeTruthy();
  });
});
