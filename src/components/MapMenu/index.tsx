import React from "react";
import API from "../../core/api";
const MapMenu: React.FC = () => {
  const ZoomIn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    API.map.zoomIn();
  };

  const ZoomOut = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    API.map.zoomOut();
  };

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
      <div className="map-menu__group">
        <div className="map-menu__item map-menu__link" onClick={ZoomIn}>
          <i className="gis-icon gis-icon--plus"></i>
        </div>
        <div className="map-menu__item map-menu__link" onClick={ZoomOut}>
          <i className="gis-icon gis-icon--minus"></i>
        </div>
      </div>
      <div className="map-menu__group">
        <div className="map-menu__item map-menu__link">
          <i className="gis-icon gis-icon--eraser-thin icon-lg"></i>
        </div>
        <div className="map-menu__item map-menu__link">
          <i className="gis-icon gis-icon--layers-remove-thin icon-lg"></i>
        </div>
      </div>
      <div className="map-menu__group">
        <div className="map-menu__item">x,y 221996,632828</div>
      </div>
    </div>
  );
};

export default MapMenu;
