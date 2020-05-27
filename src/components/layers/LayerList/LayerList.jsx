import React, { Component } from "react";
import { connect } from "react-redux";
import { Accordion, Icon } from "semantic-ui-react";
import withWidgetLifeCycle from "../../HOC/withWidgetLifeCycle";
import { logLevel, LogIt } from "../../../utils/logs";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
import { selectLayers } from "../../../redux/selectors/layersSelector";
import _ from "lodash";
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
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.Layers) return true;
    else return false;
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
    LogIt(logLevel.INFO, "Layers: " + this.props.Layers);
    var activeIndex = this.state.activeIndex;
    var layerSubjectRelation = _.cloneDeep(this.state.layerSubjectRelation);

    var layerListObject = _.cloneDeep(this.state.subjects);

    LogIt(logLevel.INFO, "We are in the layer function: " + this.props.Layers);
    var layers = this.props.Layers;
    Object.keys(layers).map((lyrId) => {
      var lyr = layers[lyrId];
      var filteredSubjectIds = layerSubjectRelation
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

    return (
      <Accordion>
        {Object.keys(layerListObject).map((subjectId, index) => (
          <React.Fragment key={index}>
            <Accordion.Title
              active={true}
              index={index}
              onClick={this.handleClick}
            >
              <Icon name="dropdown" />
              {layerListObject[subjectId].description}
            </Accordion.Title>
            <Accordion.Content active={true}>
              {this.createLayerListItems(layerListObject[subjectId].layers)}
            </Accordion.Content>
          </React.Fragment>
        ))}
      </Accordion>
    );
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <LayerListItem layerId={layerId} key={index}></LayerListItem>
    ));
  };

  render() {
    return (
      <div>
        {this.props.Layers && this.state.subjects && this.renderLayerList()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Layers: selectLayers(state), mapId: state.map.focused };
};

export default connect(mapStateToProps)(withWidgetLifeCycle(LayerList));
