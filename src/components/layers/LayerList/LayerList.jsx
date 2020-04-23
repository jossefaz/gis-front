import React, { Component } from "react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = { layers: null };
  }
  componentDidMount() {
    getMetaData("layers").then((result) => this.setState({ layers: result }));
  }
  componentWillUpdate() {
    console.log("LAYERLIST WILL UPDATE");
  }

  renderLayerList = (layers) => {
    return (
      <React.Fragment>
        {Object.keys(layers).map((lyrId, index) => (
          <LayerListItem key={index} lyr={layers[lyrId]}></LayerListItem>
        ))}
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.state.layers ? (
          this.renderLayerList(this.state.layers)
        ) : (
          <p>ToBeRendered</p>
        )}
      </React.Fragment>
    );
  }
}

export default LayerList;
