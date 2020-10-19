import React, { Component } from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import { connect } from "react-redux";
import {
  getFocusedMapProxy,
  getFocusedMap,
  getInteraction,
} from "../../../../nessMapping/api";
import { setSelectedFeatures } from "../../../../redux/actions/features";
import {
  unsetInteractions,
  setInteractions,
} from "../../../../redux/actions/interaction";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import "./style.css";
import {
  getCurrentLayersSource,
  getFeaturesByExtent,
} from "../../../../utils/features";
class Identify extends Component {
  WIDGET_NAME = "Identify";
  INTERACTIONS = {
    Select: "Select",
    DragBox: "DragBox",
  };

  sources = [];

  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  get select() {
    if (
      this.selfInteraction &&
      this.INTERACTIONS.Select in this.selfInteraction
    ) {
      return this.selfInteraction[this.INTERACTIONS.Select].uuid;
    }
    return false;
  }

  get selfInteraction() {
    if (
      this.WIDGET_NAME in this.props.Interactions &&
      this.focusedmap in this.props.Interactions[this.WIDGET_NAME]
    ) {
      return this.props.Interactions[this.WIDGET_NAME][this.focusedmap];
    }
    return false;
  }
  createSources = () => {
    if (this.sources.length > 0) {
      this.sources.map((vl) => getFocusedMap().removeLayer(vl));
      this.sources = [];
    }
    this.sources = getCurrentLayersSource();
    this.selectedFeatures = getInteraction(this.select).getFeatures();
  };
  onBoxEnd = () => {
    if (
      this.selfInteraction &&
      this.INTERACTIONS.DragBox in this.selfInteraction
    ) {
      const dragBox = getInteraction(
        this.selfInteraction[this.INTERACTIONS.DragBox].uuid
      );
      if (dragBox && this.select) {
        dragBox.on("boxstart", () => {
          getInteraction(this.select).getFeatures().clear();
        });
        dragBox.on("boxend", () => {
          const extent = dragBox.getGeometry().getExtent();
          const features = getFeaturesByExtent(extent, this.sources);
          if (features.length > 0) {
            this.props.setSelectedFeatures(features);
          }
        });
      }
    }
  };

  addInteraction = async (drawtype) => {
    await this.props.setInteractions([
      {
        Type: this.INTERACTIONS.Select,
        interactionConfig: {
          multi: true,
        },
        widgetName: this.WIDGET_NAME,
      },
      {
        Type: this.INTERACTIONS.DragBox,
        widgetName: this.WIDGET_NAME,
      },
    ]);
    this.onBoxEnd();
    this.createSources();
  };

  componentDidMount() {
    this.addInteraction();
  }

  onReset = () => {
    console.log("Reset Identify");
  };
  onUnfocus = async () => {
    if (this.selfInteraction) {
      const InteractionArray = [];
      for (let [interactionName, InteractionData] of Object.entries(
        this.selfInteraction
      )) {
        InteractionArray.push({
          uuid: InteractionData.uuid,
          widgetName: this.WIDGET_NAME,
          Type: InteractionData.Type,
        });
      }
      if (InteractionArray.length > 0) {
        await this.props.unsetInteractions(InteractionArray);
      }
    }
  };

  onFocus = async () => {
    const InteractionArray = [];
    for (let [interactionName, InteractionData] of Object.entries(
      this.selfInteraction
    )) {
      if (!InteractionData.status) {
        InteractionArray.push({
          Type: InteractionData.Type,
          widgetName: this.WIDGET_NAME,
          interactionConfig: InteractionData.interactionConfig,
        });
      }
    }
    if (InteractionArray.length > 0) {
      await this.props.setInteractions(InteractionArray);
      this.createSources();
      this.onBoxEnd();
    }
  };

  componentWillUnmount() {
    this.onUnfocus();
  }
  componentDidUpdate() {
    this.createSources();
  }

  render() {
    return (
      <React.Fragment>
        {this.focusedmap in this.props.Features &&
        "selectedFeatures" in this.props.Features[this.focusedmap] ? (
          Object.keys(this.props.Features[this.focusedmap].selectedFeatures)
            .length > 0 ? (
            <div className="flexDisplay">
              <FeatureDetail />
              <FeatureList />
              <LayersList />
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
  setInteractions,
  unsetInteractions,
  setSelectedFeatures,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidgetLifeCycle(Identify));
