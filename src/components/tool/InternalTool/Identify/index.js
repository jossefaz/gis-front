import React, { Component } from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import { connect } from "react-redux";
import { getFocusedMapProxy } from '../../../../nessMapping/api'
import { setInteraction, unsetInteraction } from "../../../../redux/actions/interaction";
import { removeInteraction } from '../../../../nessMapping/api'
import "./style.css";

class Identify extends Component {

  WIDGET_NAME = "Identify"
  INTERACTIONS = {
    Select: "Select",
    DragBox: "DragBox"
  }

  get focusedmap() {
    return getFocusedMapProxy().uuid.value
  }

  get selfInteraction() {
    if (this.WIDGET_NAME in this.props.Interactions && this.focusedmap in this.props.Interactions[this.WIDGET_NAME]) {
      return this.props.Interactions[this.WIDGET_NAME][this.focusedmap]
    }
    return false
  }





  addInteraction = async (drawtype) => {
    await this.props.setInteraction({
      Type: this.INTERACTIONS.Select,
      widgetName: this.WIDGET_NAME
    });
    await this.props.setInteraction({
      Type: this.INTERACTIONS.DragBox,
      widgetName: this.WIDGET_NAME
    });
  }

  componentDidMount() {
    this.addInteraction();
  }

  onReset = () => {
    console.log(this.selfInteraction)
  }
  onUnfocus = () => {
    this.onReset();
    if (this.selfInteraction) {
      for (let [interactionName, InteractionData] of Object.entries(this.selfInteraction)) {
        this.props.unsetInteraction({ uuid: InteractionData.uuid, widgetName: this.WIDGET_NAME, Type: InteractionData.Type })
      }
    }
  }

  onFocus = () => {
    for (let [interactionName, InteractionData] of Object.entries(this.selfInteraction)) {
      if (!InteractionData.status) {
        this.props.setInteraction({
          Type: InteractionData.Type,
          widgetName: this.WIDGET_NAME
        });
      }
    }
  }

  componentDidUpdate() {
    if (this.props.Tools.unfocus == this.props.toolID) {
      this.onUnfocus()
    }
    if (this.props.Tools.order[0] == this.props.toolID) {
      this.onFocus()
    }
    if (this.props.Tools.reset.length > 0) {
      this.props.Tools.reset.map(toolid => {
        if (toolid == this.props.toolID) {
          this.onReset()
        }
      })
    }
  }

  render() {

    return (
      <React.Fragment>
        {
          this.focusedmap in this.props.Features && "selectedFeatures" in this.props.Features[this.focusedmap] ?
            Object.keys(this.props.Features[this.focusedmap].selectedFeatures).length > 0 ?
              <div className="flexDisplay">
                <FeatureDetail focusedmap={this.focusedmap} />
                <FeatureList focusedmap={this.focusedmap} />
                <LayersList focusedmap={this.focusedmap} />
              </div>
              : <p>SELECT FEATURES ON MAP</p> : <p>SELECT FEATURES ON MAP</p>

        }
      </React.Fragment>

    );

  }

};
const mapStateToProps = (state) => {
  return {
    Features: state.Features,
    Tools: state.Tools,
    Interactions: state.Interactions,
  };
};

export default connect(mapStateToProps, { setInteraction, unsetInteraction })(Identify);

