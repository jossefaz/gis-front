import React from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import { connect } from "react-redux";
import { getFocusedMapProxy } from '../../../../nessMapping/api'
import "./style.css";

const Identify = (props) => {
  const focusedmap = getFocusedMapProxy().uuid.value
  return (
    focusedmap in props.Features && "selectedFeatures" in props.Features[focusedmap] ?
      Object.keys(props.Features[focusedmap].selectedFeatures).length > 0 ?
        <div className="flexDisplay">
          <FeatureDetail focusedmap={focusedmap} />
          <FeatureList focusedmap={focusedmap} />
          <LayersList focusedmap={focusedmap} />
        </div>
        : <p>SELECT FEATURES ON MAP</p> : <p>SELECT FEATURES ON MAP</p>
  );
};
const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps)(Identify);

