import API from "../../../core/api";

const ZoomControl: React.FC = () => {
  const ZoomIn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    API.map.zoomIn();
  };

  const ZoomOut = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    API.map.zoomOut();
  };

  return (
    <div className="map-menu__group">
      <div className="map-menu__item map-menu__link" onClick={ZoomIn}>
        <i className="gis-icon gis-icon--plus"></i>
      </div>
      <div className="map-menu__item map-menu__link" onClick={ZoomOut}>
        <i className="gis-icon gis-icon--minus"></i>
      </div>
    </div>
  );
};

export default ZoomControl;
