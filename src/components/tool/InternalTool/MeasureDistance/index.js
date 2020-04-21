import React from "react";
import { connect } from "react-redux";
import "./style.css";
const BaseMapGallery = (props) => {
  return <div className="ui grid"></div>;
};

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps)(BaseMapGallery);
