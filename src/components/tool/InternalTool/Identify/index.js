import React, {
  Component
} from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import {
  connect
} from "react-redux";
import {
  getFocusedMapProxy,
  getFocusedMap,
  getInteraction
} from '../../../../nessMapping/api';
import {
  getCenter
} from 'ol/extent';
import {
  getWidth
} from 'ol/extent';
import {
  Image as ImageLayer
} from "ol/layer";
import {
  setSelectedFeatures
} from '../../../../redux/actions/features';
import {
  unsetInteractions,
  setInteractions
} from "../../../../redux/actions/interaction";
import {
  unsetUnfocused
} from "../../../../redux/actions/tools";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle"
import "./style.css";
import axios from "axios";

class Identify extends Component {

  WIDGET_NAME = "Identify"
  INTERACTIONS = {
    Select: "Select",
    DragBox: "DragBox"
  }

  get focusedmap() {
    return getFocusedMapProxy().uuid.value
  }

  get Tools() {
    const currentMapId = getFocusedMapProxy() ? getFocusedMapProxy().uuid.value : null
    return currentMapId ? this.props.Tools[currentMapId] : null
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
            getFocusedMap()
              .getLayers()
              .getArray()
              .map(lyr => {
                if (lyr instanceof ImageLayer) {
                  var viewResolution = getFocusedMap().getView().getResolution();
                  var buffer = Math.round(getWidth(extent) * 1000)
                  var url = lyr.getSource()
                    .getFeatureInfoUrl(getCenter(extent), viewResolution, "EPSG:2039", {
                      INFO_FORMAT: "application/json",
                      feature_count: 100,
                      buffer: buffer

                    });
                  if (url) {
                    axios.get(url).then((response) => {
                      this.props.setSelectedFeatures(response.data.features);
                    });
                  }

                }
              })
          });
      }
    }
  }








  addInteraction = async (drawtype) => {
    await this.props.setInteractions([{
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
    alert("Hiii")
  }
  onUnfocus = async () => {
    if (this.selfInteraction) {
      const InteractionArray = []
      for (let [interactionName, InteractionData] of Object.entries(this.selfInteraction)) {
        InteractionArray.push({
          uuid: InteractionData.uuid,
          widgetName: this.WIDGET_NAME,
          Type: InteractionData.Type
        })
      }
      if (InteractionArray.length > 0) {
        await this.props.unsetInteractions(InteractionArray);

      }
    }

  }

  onFocus = async () => {
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
      await this.props.setInteractions(InteractionArray);
      this.onBoxEnd();
    }
  }



  componentWillUnmount() {
    this.onUnfocus()
  }

  render() {

    return ( <
      React.Fragment > {
        this.focusedmap in this.props.Features && "selectedFeatures" in this.props.Features[this.focusedmap] ?
        Object.keys(this.props.Features[this.focusedmap].selectedFeatures).length > 0 ?
        <
        div className = "flexDisplay" >
        <
        FeatureDetail / >
        <
        FeatureList / >
        <
        LayersList / >
        <
        /div> : <
        p > SELECT FEATURES ON MAP < /p> : <p>SELECT FEATURES ON MAP</p >

      } <
      /React.Fragment>

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



const mapDispatchToProps = {
  setInteractions,
  unsetInteractions,
  unsetUnfocused,
  setSelectedFeatures
}

export default connect(mapStateToProps, mapDispatchToProps)(withWidgetLifeCycle(Identify));