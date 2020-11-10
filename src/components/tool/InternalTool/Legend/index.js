import React, { Component } from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy } from "../../../../nessMapping/api";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import LegendItem from "./LegendItem";
import "./style.css";

class Legend extends Component {
  WIDGET_NAME = "Legend";
  state = {
    layers: [],
  };
  get focusedMapUUID() {
    return getFocusedMapProxy().uuid.value;
  }

  updateLegend = () => {
    if (this.focusedMapUUID in this.props.Layers) {
      const layers = [];
      Object.keys(this.props.Layers[this.focusedMapUUID]).map((layerUUID) => {
        if (this.props.Layers[this.focusedMapUUID][layerUUID].visible) {
          layers.push(layerUUID);
        }
      });
      this.setState({ layers: layers });
    }
  };

  componentDidMount() {
    this.updateLegend();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.layers.length != this.state.layers.length;
  }

  componentDidUpdate() {
    this.updateLegend();
  }

  onReset = () => {
    this.updateLegend();
  };

  onFocus = async () => {
    this.updateLegend();
  };

  renderLegend = () => {
    return this.state.layers.map((layer) => (
      <LegendItem key={layer} uuid={layer} global={true} />
    ));
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {this.state.layers.length > 0
            ? this.renderLegend()
            : "No layers added yet"}
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Layers: state.Layers,
  };
};

export default connect(mapStateToProps)(withWidgetLifeCycle(Legend));
