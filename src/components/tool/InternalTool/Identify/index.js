import React from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import { connect } from "react-redux";
import "./style.css";
const Identify = (props) => {
  return (
    Object.keys(props.SelectedLayers).length > 0 ?
      <div className="flexDisplay">
        <FeatureDetail />
        <FeatureList />
        <LayersList />
      </div>
      : <p>SELECT FEATURES ON MAP</p>
  );
};
const mapStateToProps = (state) => {
  return { SelectedLayers: state.Features.selectedFeatures, currentLayer: state.Features.currentLayer };
};

export default connect(mapStateToProps)(Identify);

