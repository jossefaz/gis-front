import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentFeature } from "../../../../../redux/actions/features";
import "./style.css";
class FeatureList extends Component {
  state = {
    current_field: null
  }

  renderFieldsSelect = () => {
    const { selectedFeatures, currentLayer, currentFeature } = this.props.Features;
    return currentLayer ? selectedFeatures[currentLayer].length > 0 ? (
      <select className="ui fluid dropdown" onChange={(event) => this.setState({ current_field: event.target.value })}>
        {
          Object.keys(selectedFeatures[currentLayer][0].properties).map((field) => typeof selectedFeatures[currentLayer][0].properties[field] == "string" ? < option key={field} value={field} > {field}</option> : null)
        }
      </select>
    )
      : null : null
  }
  renderSelectedFeature = () => {
    const { selectedFeatures, currentLayer, currentFeature } = this.props.Features;
    return currentLayer ? selectedFeatures[currentLayer].length > 0 ? (
      selectedFeatures[currentLayer].map((feature) => (

        <tr key={feature.id}>


          <td
            className={
              currentFeature
                ? currentFeature.id == feature.id
                  ? "currentFeature pointerCur"
                  : "pointerCur"
                : "pointerCur"
            }
            onClick={() => this.props.setCurrentFeature(feature.id)}
          >

            {this.state.current_field ? feature.properties[this.state.current_field] : feature.id}

          </td>
        </tr>
      ))
    ) : (
        <div>SELECT FIRST ON MAP</div>
      ) : null
  };

  render() {
    return (
      this.props.Features.currentLayer ?
        <React.Fragment>
          <table class="ui table">
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
