import React, { Component } from "react";
import { connect } from "react-redux";

import { setCurrentFeature } from "../../../../../redux/actions/features";
import { setToolProp } from "../../../../../redux/actions/tools";
import { zoomTo, highlightFeature } from '../../../../../nessMapping/api'
import IconButton from "../../../../UI/Buttons/IconButton"
import "./style.css";
class FeatureList extends Component {
  state = {
    current_field: null
  }
  focusedmap = this.props.focusedmap

  sanityCheck = () => {
    return this.focusedmap in this.props.Features &&
      "selectedFeatures" in this.props.Features[this.focusedmap] &&
      this.props.Features[this.focusedmap].currentLayer in this.props.Features[this.focusedmap].selectedFeatures &&
      this.props.Features[this.focusedmap].selectedFeatures.length > 0
  }

  get selectedFeatures() {
    return this.sanityCheck ? this.props.Features[this.focusedmap].selectedFeatures : null
  }

  get currentLayer() {
    return this.sanityCheck ? this.props.Features[this.focusedmap].currentLayer : null
  }

  get currentFeature() {
    return this.sanityCheck ? this.props.Features[this.focusedmap].currentFeature : null
  }

  renderFieldsSelect = () => {
    return this.sanityCheck ? (
      <tr><td>
        <select className="ui fluid dropdown" onChange={(event) => this.setState({ current_field: event.target.value })}>
          {
            Object.keys(this.selectedFeatures[this.currentLayer][0].properties).map((field) => typeof this.selectedFeatures[this.currentLayer][0].properties[field] == "string" ? < option key={field} value={field} > {field}</option> : null)
          }
        </select>

      </td>

      </tr>

    )
      : null
  }
  renderSelectedFeature = () => {
    return this.sanityCheck ? this.selectedFeatures[this.currentLayer].length > 0 ? (
      this.selectedFeatures[this.currentLayer].map((feature) => (

        <tr key={feature.id}>


          <td
            className={
              this.currentFeature
                ? this.currentFeature.id == feature.id
                  ? "currentFeature pointerCur flexDisplay"
                  : "pointerCur flexDisplay"
                : "pointerCur flexDisplay"
            }
            onClick={() => this.props.setCurrentFeature(feature.id)}
          >


            {this.state.current_field ? feature.properties[this.state.current_field] : feature.id}
            <IconButton
              className="ui icon button primary pointer margin05em"
              onClick={() => {
                zoomTo(feature.geometry)
                // getFocusedMap().getView().fit(new MultiPolygon(feature.geometry.coordinates))
              }}
              onHover={() => highlightFeature(feature.geometry)}
              icon="crosshairs" size="1x" />




          </td>
        </tr>
      ))
    ) : (
        <div>SELECT FIRST ON MAP</div>
      ) : null
  };

  render() {
    return (
      this.currentLayer ?
        <React.Fragment>
          <table className="ui table">
            <thead>
              <tr>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              {this.renderFieldsSelect()}
              {this.renderSelectedFeature()}

            </tbody>
          </table>

        </React.Fragment>
        :
        null

    );
  }
}

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps, { setCurrentFeature })(FeatureList);
