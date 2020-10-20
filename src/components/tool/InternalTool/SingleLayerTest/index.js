import React from "react";
import { connect } from "react-redux";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import { getFocusedMap } from "../../../../nessMapping/api";
import { newVectorSource } from "../../../../utils/features";

const LayerSample = {
  id: 1,
  name: "dimigcompile",
  alias: "שכבה לדוגמא",
  url: "http://localhost:8080/geoserver/Jeru/wms",
  params: {
    LAYERS: "Jeru:dimigcompile",
    SRS: "EPSG:2039",
  },
  serverType: "geoserver",
  visible: 1,
  selectable: 1,
};
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
          url: LayerSample.url,
          serverType: LayerSample.serverType,
          crossOrigin: "Anonymous",
        }),
      });
      newLyr.selectable = LayerSample.selectable;
      const vectorSource = newVectorSource(
        LayerSample.url,
        LayerSample.params.SRS,
        LayerSample.params.LAYERS
      );
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        opacity: 0,
      });

      vectorLayer.selectable = LayerSample.selectable;

      getFocusedMap().addLayer(vectorLayer);
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

export default connect(mapStateToProps)(SingleLayerTest);
