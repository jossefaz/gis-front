import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { Accordion, Icon } from "semantic-ui-react";
import { logLevel, LogIt } from "../../../utils/logs";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
import "./style.css";
class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      layers: {},
      subjects: {},
      layerSubjectRelation: [],
      layerListObject: {},
    };
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    var activeIndex = this.state.activeIndex;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };
  componentDidMount() {
    LogIt(logLevel.INFO, "layer list componentDidMount");
    this.fetchMetaDataFromServer();
  }

  fetchMetaDataFromServer = async () => {
    const [subjectsResult, layerSubjectResult] = await Promise.all([
      getMetaData("subjects"),
      getMetaData("layerListRelations"),
    ]);

    if (subjectsResult && layerSubjectResult) {
      var subjectList = {};
      subjectsResult.map((subject) => {
        subject.layers = {};
        subjectList[subject.subjectid] = subject;
      });
      this.setState({
        layers: this.props.Layers,
        subjects: subjectList,
        layerSubjectRelation: layerSubjectResult,
      });
    }
  };

  renderLayerList = () => {
    LogIt(logLevel.INFO, "got to this function how many times?");
    var activeIndex = this.state.activeIndex;

    if (this.state.subjects) {
      var layerListObject = this.state.subjects;

      if (
        this.props.mapId &&
        this.props.mapId in this.props.Layers &&
        JSON.stringify(this.props.Layers) !== "{}" &&
        JSON.stringify(this.state.subjects) !== "{}"
      ) {
        var layers = this.props.Layers[this.props.mapId];
        Object.keys(layers).map((lyrId) => {
          var lyr = layers[lyrId];
          var filteredSubjectIds = this.state.layerSubjectRelation
            .filter((relation) => {
              return lyr.semanticId === relation.semanticid;
            })
            .map((relation) => {
              return relation.subjectid;
            });
          filteredSubjectIds.map((subjectid) => {
            layerListObject[subjectid].layers[lyr.uuid] = lyr;
          });
        });
      }

      return (
        <Accordion>
          {Object.keys(layerListObject).map((subjectId, index) => (
            <React.Fragment key={index}>
              <Accordion.Title
                active={activeIndex === index}
                index={index}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                {layerListObject[subjectId].description}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === index}>
                {this.createLayerListItems(layerListObject[subjectId].layers)}
              </Accordion.Content>
            </React.Fragment>
          ))}
        </Accordion>
      );
    }
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <LayerListItem key={index} lyr={layers[layerId]}></LayerListItem>
    ));
  };

  render() {
    return <React.Fragment>{this.renderLayerList()}</React.Fragment>;
  }
}

const mapStateToProps = (state) => {
  return { Layers: state.Layers, mapId: state.map.focused };
};

export default connect(mapStateToProps)(LayerList);
