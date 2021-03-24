import React from "react";
import { connect } from "react-redux";
import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import API from "../../../../core/api";
import { addLayers } from "../../../../state/actions";
import config from "react-global-configuration";
const LayerSample = {
  id: 1,
  name: "dimigcompile",
  alias: "שכבה לדוגמא",
  url: config.get("Geoserver"),
  params: {
    LAYERS: "Jeru:dimigcompile",
    SRS: "EPSG:2039",
  },
  serverType: "geoserver",
  visible: 1,
  selectable: 1,
  editable: 1,
};

const { getFocusedMap } = API.map;
class SingleLayerTest extends React.Component {
  state = {
    added: false,
  };

  componentDidMount() {}
  componentDidUpdate() {}

  handleClick = () => {
    if (!this.state.added) {
      const newLyr = new ImageLayer({
        source: new ImageWMS({
          params: LayerSample.params,
          url: `${LayerSample.url}/wms`,
          serverType: LayerSample.serverType,
          crossOrigin: "Anonymous",
        }),
      });
      newLyr.set("editable", LayerSample.editable);
      newLyr.set("__NessUUID__", LayerSample.name);
      getFocusedMap().addLayer(newLyr);
      this.setState({ added: true });
    }
  };

  render() {
    return (
      <React.Fragment>
        <button className="ui icon button" onClick={() => this.handleClick()}>
          Add a layer
        </button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { map: state.map };
};

export default connect(mapStateToProps, { addLayers })(SingleLayerTest);
