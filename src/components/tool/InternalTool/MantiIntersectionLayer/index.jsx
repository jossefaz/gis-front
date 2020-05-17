import React from "react";
import { connect } from "react-redux";
import GeoJSON from "ol/format/GeoJSON.js";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Style from "ol/style/Style";
import NessMapping from "../../../../nessMapping/mapping";
import { loadChannels } from "../../../../communication/communicationManager";
import { geoJsonMantiIntersection } from "../../../../configuration/mantiIntersections";
import { selectUnits } from "../../../../redux/selectors/mantiSystemsSelector";
import { FeatureLayer } from "../../../../components/layers/FeatureLayer.js";

const styleFunction = function (feature, resolution) {
  var styleOL = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: "green",
      }),
    }),
  });
  var styleCPS = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: "blue",
      }),
    }),
  });

  var styleOFFL = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: "black",
      }),
    }),
  });

  var styleFAIL = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: "red",
      }),
    }),
  });

  switch (feature.get("cstat")) {
    case "OL":
      return [styleOL];
    case "CPS":
      return [styleCPS];
    case "FAIL":
      return [styleFAIL];
    default:
      return [styleOFFL];
  }
};

const styleFunctionFilter = function (feature, resolution) {
  var styleFAIL = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: "red",
      }),
    }),
  });

  switch (feature.get("cstat")) {
    case "FAIL":
      return [styleFAIL];
  }
};

class MantiIntersectionLayer extends React.Component {
  constructor(props) {
    super(props);
    this.mantiLayer = null;
  }

  handleClick = () => {
    this.mantiLayer = new FeatureLayer(null, {
      url:
        "http://localhost:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3Amanti_intersections&maxFeatures=500&outputFormat=application%2Fjson",
      format: new GeoJSON(),
      style: styleFunction,
    });

    const map = NessMapping.getInstance().getMapProxy(this.props.map.focused)
      ._olmap;
    map.addLayer(this.mantiLayer.vl);

    loadChannels();
  };
  filterLayer = () => {
    this.mantiLayer.vl.setStyle(styleFunctionFilter);
  };
  componentDidUpdate = () => {
    if (this.props.changedUnits != null && this.props.changedUnits.length > 0) {
      if (this.mantiLayer) {
        this.mantiLayer.setProperties(this.props.changedUnits, {
          targetId: "num",
          sourceId: "id",
        });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <button className="ui icon button" onClick={() => this.filterLayer()}>
          סנן צמתים מרומזרים
        </button>
        <button className="ui icon button" onClick={() => this.handleClick()}>
          הוסף צמתים מרומזרים
        </button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    map: state.map,
    changedUnits: selectUnits(state),
  };
};

export default connect(mapStateToProps)(MantiIntersectionLayer);
