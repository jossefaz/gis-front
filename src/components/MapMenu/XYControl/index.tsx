import { MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { useEffect } from "react";
import { getFocusedMap } from "../../../core/api/map";

const XYControl: React.FC = () => {
  useEffect(() => {
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: "EPSG:2039",
      className: "custom-mouse-position",
      target: document.getElementById("mouse-coordinates") as HTMLElement,
    });
    getFocusedMap().addControl(mousePositionControl);
    return () => {
      getFocusedMap().removeControl(mousePositionControl);
    };
  }, []);

  return (
    <div className="map-menu__group">
      <div className="map-menu__item" id="mouse-coordinates"></div>
    </div>
  );
};

export default XYControl;
