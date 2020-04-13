import React from "react";
import { connect } from "react-redux";
import { setRaster } from "../../../../redux/actions/raster";
import "./style.css";
const BaseMapGallery = (props) => {
  console.log(props);
  return (
    <div className="ui grid">
      {Object.keys(props.Rasters).map((raster) => (
        <div
          key={raster}
          className="item basemapLink pointerCursor"
          onClick={() => props.setRaster(raster)}
        >
          <a className="ui tiny image pointerCursor">
            <img src={`/img/${props.Rasters[raster].metadata.icon}`} />
          </a>
          <a className="header pointerCursor">
            {props.Rasters[raster].metadata.alias}
          </a>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { Rasters: state.Rasters.Catalog };
};

export default connect(mapStateToProps, { setRaster })(BaseMapGallery);
