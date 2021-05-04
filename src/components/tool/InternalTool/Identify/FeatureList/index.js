import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentFeature } from "../../../../../state/actions";
import VectorLayerRegistry from "../../../../../core/proxymanagers/vectorlayer";
import {
  selectCurrentLayer,
  selectCurrentFeature,
  selectSelectedFeatures,
} from "../../../../../state/reducers";
import API from "../../../../../core/api";
import IconButton from "../../../../UI/Buttons/IconButton";
import "./style.css";
import { Form, ListGroup } from "react-bootstrap";

const { highlightFeature, zoomTo } = API.features;
const { getFocusedMapProxy } = API.map;
class FeatureList extends Component {
  state = {
    current_field: "id",
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

  renderOptions = () => {
    const properties = this.selectedFeatures[this.props.selectedLayer][0]
      .properties;
    return Object.keys(properties).map((field) => {
      if (
        typeof properties[field] == "string" ||
        typeof properties[field] == "number"
      )
        return (
          <option
            selected={field == this.state.current_field}
            key={field}
            value={field}
          >
            {field}
          </option>
        );
    });
  };

  renderFieldsSelect = () => {
    return (
      this.selectedFeatures &&
      this.currentLayer &&
      this.props.selectedLayer in this.selectedFeatures && (
        <Form.Group className="px-tool">
          <Form.Control
            as="select"
            custom
            onChange={(event) =>
              this.setState({ current_field: event.target.value })
            }
          >
            {this.renderOptions()}
          </Form.Control>
        </Form.Group>
      )
    );
  };
  renderSelectedFeature = () => {
    return this.props.selectedLayer in this.selectedFeatures ? (
      this.selectedFeatures[this.props.selectedLayer].length > 0 ? (
        <ListGroup variant="flush">
          {this.selectedFeatures[this.props.selectedLayer].map((feature) => (
            <ListGroup.Item
              action
              key={feature.id}
              className="px-tool"
              active={
                this.currentFeature && this.currentFeature.id === feature.id
              }
              onClick={() => {
                this.props.setCurrentFeature(feature.id);
                const f = this.vectorLayerRegistry.getFeatureFromNamedLayer(
                  feature.parentlayerProperties.uuid,
                  feature.id
                );
                f && zoomTo(f.getGeometry());
              }}
              onMouseOver={async () => {
                const f = this.vectorLayerRegistry.getFeatureFromNamedLayer(
                  feature.parentlayerProperties.uuid,
                  feature.id
                );
                f && highlightFeature(f.getGeometry());
              }}
            >
              {this.state.current_field
                ? feature.properties[this.state.current_field]
                : feature.id}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div>SELECT FIRST ON MAP</div>
      )
    ) : null;
  };

  render() {
    return (
      this.currentLayer && (
        <React.Fragment>
          {this.renderFieldsSelect()}
          {this.renderSelectedFeature()}
        </React.Fragment>
      )
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
  };
};

export default connect(mapStateToProps, { setCurrentFeature })(FeatureList);
