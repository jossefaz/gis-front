
import React, { Component } from "react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { connect } from 'react-redux'
class LayerList extends Component {

  renderLayerList = (layers) => {
    return (
      <React.Fragment>
        {
          Object.keys(layers).map((lyrId) =>
            <LayerListItem
              name={layers[lyrId].name}
              key={layers[lyrId].id}
              lyrID={layers[lyrId].id}
              alias={layers[lyrId].alias}
              visible={layers[lyrId].visible}>
            </LayerListItem>
          )
        }
      </React.Fragment>

    )

  }


  render() {
    return (
      <React.Fragment>
        {
          this.props.mapLayers ? this.renderLayerList(this.props.mapLayers) : <p>ToBeRendered</p>
        }
      </React.Fragment>

    )

  }
}
const mapStateToProps = (state) => {
  return { mapLayers: state.mapLayers };
};


export default connect(mapStateToProps, null)(LayerList);

