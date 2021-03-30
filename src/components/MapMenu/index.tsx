import ZoomControl from "./ZoomControl";
import XYControl from "./XYControl";

const MapMenu: React.FC = () => {
  return (
    <div className="map-menu">
      <div className="map-menu__group">
        <div className="map-menu__item map-menu__item--header">
          מרכז ניהול תנועה ירושלים
        </div>
      </div>
      <div className="map-menu__group">
        <div className="map-menu__item map-menu__link active">
          <i className="gis-icon gis-icon--location-on-map icon-lg"></i>
        </div>
        <div className="map-menu__item map-menu__link">
          <i className="gis-icon gis-icon--picture icon-lg"></i>
        </div>
        <div className="map-menu__item map-menu__link">
          <i className="gis-icon gis-icon--location-on-pic icon-lg"></i>
        </div>
      </div>
      <ZoomControl />
      <div className="map-menu__group">
        <div className="map-menu__item map-menu__link">
          <i className="gis-icon gis-icon--eraser-thin icon-lg"></i>
        </div>
        <div className="map-menu__item map-menu__link">
          <i className="gis-icon gis-icon--layers-remove-thin icon-lg"></i>
        </div>
      </div>
      <XYControl />
    </div>
  );
};

export default MapMenu;
