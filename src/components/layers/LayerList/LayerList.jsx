import React, { Component } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
import "./style.css";
class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = { layers: {}, subjects: {}, layerSubjectRelation: [] };
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
  };
  componentWillUpdate() {
    console.log("LAYERLIST WILL UPDATE");
  }

  renderLayerList = () => {
    var subjects = this.state.subjects;
    return Object.keys(subjects).map((subjectId) => (
      <React.Fragment key={subjectId}>
        <Dropdown item text={subjects[subjectId].description}>
          <Dropdown.Menu>{this.createLayerListItems(subjectId)}</Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    ));
  };

  createLayerListItems = (subjectId) => {
    var filteredLayerIds = this.state.layerSubjectRelation
      .filter((relation) => {
        return subjectId === relation.subjectid.toString();
      })
      .map((relation) => {
        return relation.semanticid;
      });
    return filteredLayerIds.map((layerId, index) =>
      this.state.layers[layerId] ? (
        <Dropdown.Item key={index}>
          <LayerListItem
            key={index}
            lyr={this.state.layers[layerId]}
          ></LayerListItem>
        </Dropdown.Item>
      ) : null
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.state.subjects &&
        this.state.layers &&
        this.state.layerSubjectRelation ? (
          this.renderLayerList()
        ) : (
          <p>ToBeRendered</p>
        )}
      </React.Fragment>
    );
  }
}

export default LayerList;
