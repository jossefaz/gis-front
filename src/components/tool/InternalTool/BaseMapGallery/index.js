import React from "react";
import { connect } from "react-redux";
import { setRaster } from "../../../../redux/actions/raster";

const BaseMapGallery = (props) => {
  return (
    <button onClick={() => props.setRaster("wms4326")}>Set new Raster</button>
  );
};

const mapStateToProps = (state) => {
  return { Rasters: state.Rasters };
};

export default connect(mapStateToProps, { setRaster })(BaseMapGallery);
