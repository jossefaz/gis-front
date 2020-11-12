import React, { Component } from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy } from "../../../../nessMapping/api";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import { selectVisibleLayers } from "../../../../redux/reducers";
import LegendItem from "./LegendItem";
import "./style.css";

class Legend extends Component {
  WIDGET_NAME = "Legend";

  renderLegend = () => {
    return this.props.Layers.map((layer) => (
      <LegendItem key={layer} uuid={layer} global={true} />
    ));
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {this.props.Layers.length > 0
            ? this.renderLegend()
            : "No layers added yet"}
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Layers: selectVisibleLayers(state),
  };
};

export default connect(mapStateToProps)(withWidgetLifeCycle(Legend));
