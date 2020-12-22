import React, { Component } from "react";
import { connect } from "react-redux";

import { setCurrentFeature } from "../../../../../redux/actions/features";
import VectorLayerRegistry from "../../../../../utils/vectorlayers";
import {
  selectCurrentLayer,
  selectSelectedFeatureInCurrentLayer,
  selectCurrentFeature,
  selectSelectedFeatures,
} from "../../../../../redux/reducers";
import {
  zoomTo,
  highlightFeature,
  getFocusedMapProxy,
} from "../../../../../nessMapping/api";
import IconButton from "../../../../UI/Buttons/IconButton";
import "./style.css";
class FeatureList extends Component {
  state = {
    current_field: null,
  };
  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  get vectorLayerRegistry() {
    return VectorLayerRegistry.getInstance();
  }

  get selectedFeatures() {
    return this.props.selectedFeatures;
  }

  get currentLayer() {
    return this.props.currentLayer;
  }

  get currentFeature() {
    return this.props.currentFeature;
  }

  get currentSelectedFeatures() {
    return this.props.currentSelectedFeatures;
  }

  renderFieldsSelect = () => {
    return (
      this.selectedFeatures &&
      this.currentLayer && (
        <tr>
          <td>
            <select
              className="ui fluid dropdown"
              onChange={(event) =>
                this.setState({ current_field: event.target.value })
              }
            >
              {Object.keys(this.currentSelectedFeatures[0].properties).map(
                (field) =>
                  typeof this.currentSelectedFeatures[0].properties[field] ==
                    "string" ||
                  typeof this.currentSelectedFeatures[0].properties[field] ==
                    "number" ? (
                    <option key={field} value={field}>
                      {" "}
                      {field}
                    </option>
                  ) : null
              )}
            </select>
          </td>
        </tr>
      )
    );
  };
  renderSelectedFeature = () => {
    return this.currentSelectedFeatures ? (
      this.currentSelectedFeatures.length > 0 ? (
        this.currentSelectedFeatures.map((feature) => (
          <tr key={feature.id}>
            <td
              className={
                this.currentFeature
                  ? this.currentFeature.id == feature.id
                    ? "currentFeature pointerCur flexDisplay"
                    : "pointerCur flexDisplay"
                  : "pointerCur flexDisplay"
              }
              onClick={() => {
                this.props.setCurrentFeature(feature.id);
              }}
            >
              {this.state.current_field
                ? feature.properties[this.state.current_field]
                : feature.id}
              <IconButton
                className="ui icon button primary pointer margin05em"
                onClick={async () => {
                  const f = this.vectorLayerRegistry.getFeatureFromNamedLayer(
                    feature.__Parent_NessUUID__,
                    feature.id
                  );
                  f && zoomTo(f.getGeometry());
                  // getFocusedMap().getView().fit(new MultiPolygon(feature.geometry.coordinates))
                }}
                onHover={async () => {
                  const f = this.vectorLayerRegistry.getFeatureFromNamedLayer(
                    feature.__Parent_NessUUID__,
                    feature.id
                  );
                  f && highlightFeature(f.getGeometry());
                }}
                icon="crosshairs"
                size="1x"
              />
            </td>
          </tr>
        ))
      ) : (
        <div>SELECT FIRST ON MAP</div>
      )
    ) : null;
  };

  render() {
    return this.currentLayer ? (
      <React.Fragment>
        <table className="ui table ">
          <thead>
            <tr>
              <th>Features</th>
            </tr>
          </thead>

          <tbody className="scrollContent">
            {this.renderFieldsSelect()}
            {this.renderSelectedFeature()}
          </tbody>
        </table>
      </React.Fragment>
    ) : null;
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

export default connect(mapStateToProps, { setCurrentFeature })(FeatureList);
