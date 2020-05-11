import React, { Component } from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import { connect } from "react-redux";
import { getFocusedMapProxy, getFocusedMap, getInteraction } from '../../../../nessMapping/api'
import { unsetInteractions, setInteractions } from "../../../../redux/actions/interaction";
import { unsetUnfocused } from "../../../../redux/actions/tools";
import { Vector as VectorSource } from 'ol/source';
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

  onBoxEnd = () => {
    if (this.selfInteraction && this.INTERACTIONS.DragBox in this.selfInteraction) {
      const dragBox = getInteraction(this.selfInteraction[this.INTERACTIONS.DragBox].uuid)
      if (dragBox) {
        dragBox.on('boxend',
          () => {
            var extent = dragBox.getGeometry().getExtent();
            console.log(extent)

          });

      }

    }

  }

  // createSources = () => {
  //   var viewResolution = mapObject.getView().getResolution();
  //   getFocusedMap()
  //     .getLayers()
  //     .getArray()
  //     .map((lyr) => {
  //       new VectorSource({
  //         url: 'data/geojson/countries.geojson',
  //         format: new GeoJSON()
  //       });
  //       if (lyr instanceof ImageLayer && lyr.selectable) {
  //         var url = lyr
  //           .getSource()
  //           .getFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:4326", {
  //             INFO_FORMAT: "application/json",
  //             feature_count: 100,
  //           });
  //         if (url) {
  //           axios.get(url).then((response) => {
  //             actionCB(response.data.features);
  //           });
  //         }
  //       }
  //     });
  // };







  addInteraction = async (drawtype) => {
    await this.props.setInteractions([
      {
        Type: this.INTERACTIONS.Select,
        widgetName: this.WIDGET_NAME
      },
      {
        Type: this.INTERACTIONS.DragBox,
        widgetName: this.WIDGET_NAME
      }
    ]);
    this.onBoxEnd();
  }

  componentDidMount() {
    this.addInteraction();
  }

  onReset = () => {
    console.log(this.selfInteraction)
  }
  onUnfocus = async () => {
    if (this.selfInteraction) {
      const InteractionArray = []
      for (let [interactionName, InteractionData] of Object.entries(this.selfInteraction)) {
        InteractionArray.push({ uuid: InteractionData.uuid, widgetName: this.WIDGET_NAME, Type: InteractionData.Type })
      }
      if (InteractionArray.length > 0) {
        await this.props.unsetUnfocused(this.props.toolID)
        await this.props.unsetInteractions(InteractionArray);

      }
    }

  }

  onFocus = () => {
    const InteractionArray = []
    for (let [interactionName, InteractionData] of Object.entries(this.selfInteraction)) {
      if (!InteractionData.status) {
        InteractionArray.push({
          Type: InteractionData.Type,
          widgetName: this.WIDGET_NAME
        })

      }
    }
    if (InteractionArray.length > 0) {
      this.props.setInteractions(InteractionArray);
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

  componentWillUnmount() {
    this.onUnfocus()
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

export default connect(mapStateToProps, { setInteractions, unsetInteractions, unsetUnfocused })(Identify);

