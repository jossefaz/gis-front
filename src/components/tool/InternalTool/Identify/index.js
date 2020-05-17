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
import { getCenter } from "ol/extent";
import { getWidth } from "ol/extent";
import { Image as ImageLayer } from "ol/layer";
import { setSelectedFeatures } from "../../../../redux/actions/features";
import {
  unsetInteractions,
  setInteractions,
} from "../../../../redux/actions/interaction";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import "./style.css";
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import axios from "axios";
import { projIsrael } from '../../../../utils/projections'
class Identify extends Component {
  WIDGET_NAME = "Identify";
  INTERACTIONS = {
    Select: "Select",
    DragBox: "DragBox",
  };

  sources = []

  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  get Tools() {
    const currentMapId = getFocusedMapProxy()
      ? getFocusedMapProxy().uuid.value
      : null;
    return currentMapId ? this.props.Tools[currentMapId] : null;
  }

  get select() {
    if (this.selfInteraction && this.INTERACTIONS.Select in this.selfInteraction) {
      return this.selfInteraction[this.INTERACTIONS.Select].uuid
    }
    return false
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

    // var vectorSource = new VectorSource({
    //   url: "http://localhost:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3Adimigcompile&maxFeatures=50&outputFormat=application%2Fjson",
    //   format: new GeoJSON({
    //     dataProjection: projIsrael
    //   }),
    // });

    getFocusedMap().getLayers()
      .getArray()
      .map((lyr) => {
        if (lyr instanceof ImageLayer) {
          const vectorSource = new VectorSource({
            url: `${lyr.getSource().getUrl()}&service=WMS&version=1.1.0&request=GetMap&bbox=208971.15625%2C628413.125%2C224400.078125%2C634831.9375&width=768&height=330&srs=EPSG%3A2039&format=geojson`,
            format: new GeoJSON({
              dataProjection: projIsrael
            }),
          });
          getFocusedMap()
            .addLayer(new VectorLayer({
              source: vectorSource,
              opacity: 0
            }))
          this.sources.push(vectorSource)
          this.selectedFeatures = getInteraction(this.select).getFeatures();
        }
      })
  }
  onBoxEnd = () => {
    if (
      this.selfInteraction &&
      this.INTERACTIONS.DragBox in this.selfInteraction
    ) {
      const dragBox = getInteraction(
        this.selfInteraction[this.INTERACTIONS.DragBox].uuid
      );
      if (dragBox && this.select) {
        dragBox.on('boxstart', () => {
          getInteraction(this.select).getFeatures().clear();
        });
        dragBox.on("boxend", () => {
          var selectedFeatures = []
          var extent = dragBox.getGeometry().getExtent();
          this.sources.map(vs => {
            vs.forEachFeatureInExtent(extent, (feature) => {
              this.selectedFeatures.push(feature)
              selectedFeatures.push(feature)
            }
            )
          });
          this.props.setSelectedFeatures(selectedFeatures)

        }

        );
      }
    }
  };


  addInteraction = async (drawtype) => {
    await this.props.setInteractions([
      {
        Type: this.INTERACTIONS.Select,
        interactionConfig: {
          multi: true
        },
        widgetName: this.WIDGET_NAME,
      },
      {
        Type: this.INTERACTIONS.DragBox,
        widgetName: this.WIDGET_NAME,
      },
    ]);
    this.onBoxEnd();
    this.createSources()

  };

  componentDidMount() {
    this.addInteraction();
  }

  onReset = () => {
    alert("Hiii");
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
          interactionConfig: InteractionData.interactionConfig
        });
      }
    }
    if (InteractionArray.length > 0) {
      await this.props.setInteractions(InteractionArray);
      this.createSources()
      this.onBoxEnd();
    }
  };

  componentWillUnmount() {
    this.onUnfocus();
  }

  render() {
    return (
      <React.Fragment>
        {this.focusedmap in this.props.Features &&
          "selectedFeatures" in this.props.Features[this.focusedmap] ? (
            Object.keys(this.props.Features[this.focusedmap].selectedFeatures).length > 0 ? (
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
    Tools: state.Tools,
    Interactions: state.Interactions,
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



