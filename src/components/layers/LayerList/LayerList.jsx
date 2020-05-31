import React, { Component } from "react";
import { connect } from "react-redux";
import { Accordion, Icon } from "semantic-ui-react";
import withWidgetLifeCycle from "../../HOC/withWidgetLifeCycle";
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
    this.fetchMetaDataFromServer();
  }
  onReset = () => {
    console.log("test the layerlist!");
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      layers: nextProps.Layers,
    };
  }

  componentDidUpdate(nextProps) {
    var layers = this.props.Layers;
    if (layers && layers !== nextProps.Layers) {
      this.setState({ layers: layers });
      this.renderLayerList();
    }
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
    if (this.state.layers) {
      var layerSubjectRelation = _.cloneDeep(this.state.layerSubjectRelation);

      var layerListObject = _.cloneDeep(this.state.subjects);

      var layers = this.state.layers;
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
      this.setState({ layerListObject: layerListObject });
    }
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <LayerListItem layerId={layerId} key={index}></LayerListItem>
    ));
  };

  render() {
    var activeIndex = this.state.activeIndex;
    return (
      <Accordion>
        {Object.keys(this.state.layerListObject).map((subjectId, index) => (
          <React.Fragment key={index}>
            <Accordion.Title
              active={activeIndex === index}
              index={index}
              onClick={this.handleClick}
            >
              <Icon name="dropdown" />
              {this.state.layerListObject[subjectId].description}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
              {this.createLayerListItems(
                this.state.layerListObject[subjectId].layers
              )}
            </Accordion.Content>
          </React.Fragment>
        ))}
      </Accordion>
    );
  }
}

const mapStateToProps = (state) => {
  return { Layers: selectLayers(state, state.map.focused) };
};

export default connect(mapStateToProps)(withWidgetLifeCycle(LayerList));
