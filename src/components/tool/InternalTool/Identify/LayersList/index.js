import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentLayer } from "../../../../../redux/actions/features";
import { getFocusedMapProxy } from "../../../../../nessMapping/api";
import {
  selectCurrentLayer,
  selectSelectedFeatureInCurrentLayer,
  selectCurrentFeature,
  selectSelectedFeatures,
} from "../../../../../redux/reducers";
import "./style.css";
class FeatureList extends Component {
  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  renderSelectedFeature = () => {
    return this.props.selectedFeatures
      ? Object.keys(this.props.selectedFeatures).map((layer) => (
          <tr key={layer}>
            <td
              className={
                this.props.currentLayer
                  ? this.props.currentLayer == layer
                    ? "currentLayer pointerCur"
                    : "pointerCur"
                  : "pointerCur"
              }
              onClick={() => this.props.setCurrentLayer(layer)}
            >
              {layer}
            </td>
          </tr>
        ))
      : null;
  };

  render() {
    return (
      <React.Fragment>
        <table className="ui table">
          <thead>
            <tr>
              <th>Layers</th>
            </tr>
          </thead>
          <tbody className="scrollContent">
            {this.renderSelectedFeature()}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Features: state.Features,
    map: state.map.focused,
    selectedFeatures: selectSelectedFeatures(state),
    currentLayer: selectCurrentLayer(state),
    currentFeature: selectCurrentFeature(state),
    currentSelectedFeatures: selectSelectedFeatureInCurrentLayer(state),
  };
};

export default connect(mapStateToProps, { setCurrentLayer })(FeatureList);
