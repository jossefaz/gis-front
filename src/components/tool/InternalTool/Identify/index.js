import React, { Component } from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import { connect } from "react-redux";
import { getFocusedMapProxy, getFocusedMap } from "../../../../nessMapping/api";
import { setSelectedFeatures } from "../../../../redux/actions/features";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import "./style.css";
import { getFeaturesByExtent } from "../../../../utils/features";
import { InteractionUtil } from "../../../../utils/interactions";
class Identify extends Component {
  WIDGET_NAME = "Identify";
  INTERACTIONS = {
    Select: "Select",
    DragBox: "DragBox",
  };

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
  }

  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  get select() {
    return this.interactions.currentSelectUUID;
  }

  get selfInteraction() {
    return this.interactions.store;
  }

  onEditGeometry = (feature) => {
    this.interactions.modifyFeature(feature);
  };

  onBoxEnd = () => {
    if (this.interactions.currentDragBoxUUID) {
      const dragBox = this.interactions.currentDragBox;
      const endListener = () => {
        console.log("dragboxend", this.interactions.currentDragBox);
        const extent = dragBox.getGeometry().getExtent();
        const features = getFeaturesByExtent(extent);
        if (features.length > 0) {
          this.props.setSelectedFeatures(features);
        }
      };
      if (dragBox) {
        dragBox.on("boxend", endListener);
      }
    }
  };

  addInteraction = (drawtype) => {
    this.interactions.newDragBox();
    this.onBoxEnd();
  };

  removeInteraction = () => {
    this.interactions.unDragBox();
  };

  componentDidMount() {
    this.addInteraction();
  }

  onReset = () => {
    console.log("Reset Identify");
  };
  onUnfocus = () => {
    this.removeInteraction();
  };

  onFocus = () => {
    this.addInteraction();
  };

  componentWillUnmount() {
    this.onUnfocus();
  }

  render() {
    return (
      <React.Fragment>
        {this.focusedmap in this.props.Features &&
        "selectedFeatures" in this.props.Features[this.focusedmap] ? (
          Object.keys(this.props.Features[this.focusedmap].selectedFeatures)
            .length > 0 ? (
            <div className="flexDisplay">
              <LayersList />
              <FeatureList />
              <FeatureDetail onEditGeometry={this.onEditGeometry} />
            </div>
          ) : (
            <p> SELECT FEATURES ON MAP </p>
          )
        ) : (
          <p>SELECT FEATURES ON MAP</p>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Features: state.Features,
    Interactions: state.Interactions,
    Layers: state.Layers,
  };
};

const mapDispatchToProps = {
  setSelectedFeatures,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidgetLifeCycle(Identify));
