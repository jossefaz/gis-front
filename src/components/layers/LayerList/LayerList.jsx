import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { logLevel, LogIt } from "../../../utils/logs";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
import "./style.css";
class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: {},
      subjects: {},
      layerSubjectRelation: [],
      layerListObject: {},
    };
  }
  componentDidMount() {
    this.fetchMetaDataFromServer();
  }

  fetchMetaDataFromServer = async () => {
    const [
      layersResult,
      subjectsResult,
      layerSubjectResult,
    ] = await Promise.all([
      getMetaData("layers"),
      getMetaData("subjects"),
      getMetaData("layerListRelations"),
    ]);

    if (layersResult && subjectsResult && layerSubjectResult) {
      console.log(subjectsResult);
      var subjectList = {};
      var layerList = {};
      subjectsResult.map((subject) => {
        subject.layers = {};
        subjectList[subject.subjectid] = subject;
      });
      layersResult.map((layer) => {
        layerList[layer.semanticid] = layer;
      });
      this.setState({
        layers: layerList,
        subjects: subjectList,
        layerSubjectRelation: layerSubjectResult,
      });
    }
    this.setLayerListObject();
  };

  setLayerListObject = () => {
    if (this.state.subjects) {
      var layerListObject = this.state.subjects;

      Object.keys(this.state.layers).map((lyrId) => {
        var lyr = this.state.layers[lyrId];
        var filteredSubjectIds = this.state.layerSubjectRelation
          .filter((relation) => {
            return lyrId === relation.semanticid.toString();
          })
          .map((relation) => {
            return relation.subjectid;
          });

        filteredSubjectIds.map((subjectid) => {
          //TODO change semanticid to uuid
          layerListObject[subjectid].layers[lyr.semanticid] = lyr;
        });
      });
      this.setState({ layerListObject: layerListObject });
      LogIt(logLevel.INFO, "Map Update");
    }
  };

  renderLayerList = () => {
    var layerListObject = this.state.layerListObject;
    return Object.keys(layerListObject).map((subjectId) => (
      <React.Fragment key={subjectId}>
        <Dropdown item text={layerListObject[subjectId].description}>
          <Dropdown.Menu>
            {this.createLayerListItems(layerListObject[subjectId].layers)}
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    ));
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <Dropdown.Item key={index}>
        <LayerListItem
          key={index}
          lyr={this.state.layers[layerId]}
        ></LayerListItem>
      </Dropdown.Item>
    ));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.subjects &&
        this.state.layers &&
        this.state.layerSubjectRelation &&
        this.state.layerListObject ? (
          this.renderLayerList()
        ) : (
          <p>ToBeRendered</p>
        )}
      </React.Fragment>
    );
  }
}

export default LayerList;
