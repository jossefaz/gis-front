import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentFeatureLayer } from "../../../../../state/actions";
import API from "../../../../../core/api";
import {
  selectCurrentLayer,
  selectSelectedFeatureInCurrentLayer,
  selectCurrentFeature,
  selectSelectedFeatures,
} from "../../../../../state/reducers";
import FeatureList from "../FeatureList";
import { Accordion } from "react-bootstrap";

class LayersList extends Component {
  get focusedmap() {
    return API.map.getFocusedMapProxy().uuid.value;
  }

  handleSelect = (layer) => {
    this.props.setCurrentFeatureLayer(layer);
  };

  renderSelectedFeature = () => {
    debugger;
    return this.props.selectedFeatures
      ? Object.keys(this.props.selectedFeatures).map((layer) => (
          <React.Fragment key={layer}>
            <Accordion.Toggle
              as="div"
              eventKey={layer}
              className="py-2 border-bottom px-tool"
            >
              + {this.props.selectedFeatures[layer][0].layerAlias}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={layer}>
              <div className="py-3">
                <FeatureList selectedLayer={layer} />
              </div>
            </Accordion.Collapse>
          </React.Fragment>
        ))
      : null;
  };

  render() {
    return (
      <React.Fragment>
        <div className="text-primary font-weight-bold px-tool py-3 border-bottom">
          זיהוי יישויות
        </div>
        <Accordion onSelect={this.handleSelect} className="layers-groups">
          {this.renderSelectedFeature()}
        </Accordion>
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

export default connect(mapStateToProps, { setCurrentFeatureLayer })(LayersList);
