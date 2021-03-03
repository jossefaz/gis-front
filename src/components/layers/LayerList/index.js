import React, { Component } from "react";
import { connect } from "react-redux";
import { Accordion, Button, Icon } from "semantic-ui-react";
import LayerListItem from "../LayerListItem/index.js";
import { getMetaData } from "../../../communication/mdFetcher";
import { selectLayers } from "../../../state/selectors/layersSelector";
import _ from "lodash";
import "../style.css";

class LayerList extends Component {
  state = {
    activeIndex: -1,
    layers: {},
    subjects: {},
    layerSubjectRelation: [],
    layerListObject: {},
    closeLayerListItem: false,
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    var activeIndex = this.state.activeIndex;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  componentDidMount() {
    this.fetchMetaDataFromServer();
  }

  static getDerivedStateFromProps(props, state) {
    return {
      layers: props.layers,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      Object.keys(prevState.layers).length !==
        Object.keys(this.state.layers).length ||
      prevState.layers !== this.state.layers
    ) {
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
      subjectsResult.forEach((subject) => {
        subject.layers = {};
        subjectList[subject.subjectid] = subject;
      });
      this.setState(
        {
          subjects: subjectList,
          layerSubjectRelation: layerSubjectResult,
        },
        () => {
          this.renderLayerList();
        }
      );
    }
  };

  renderLayerList = () => {
    var layerSubjectRelation = _.cloneDeep(this.state.layerSubjectRelation);
    var layerListObject = _.cloneDeep(this.state.subjects);

    var layers = this.state.layers;
    Object.keys(layers).forEach((lyrId) => {
      var lyr = layers[lyrId];
      var filteredSubjectIds = layerSubjectRelation
        .filter((relation) => {
          return lyr.semanticId === relation.semanticid;
        })
        .map((relation) => {
          return relation.subjectid;
        });
      filteredSubjectIds.forEach((subjectid) => {
        layerListObject[subjectid].layers[lyr.uuid] = lyr;
      });
    });
    this.setState({ layerListObject: layerListObject });
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <LayerListItem
        layerId={layerId}
        execCloseLayerListItem={this.execCloseLayerListItem}
        key={index}
        closeItem={this.state.closeLayerListItem}
      ></LayerListItem>
    ));
  };

  execCloseLayerListItem = (close) => {
    this.setState({ closeLayerListItem: close });
  };

  render() {
    return (
      <React.Fragment>
        <Accordion className="uirtl">
          {Object.keys(this.state.layerListObject).map((subjectId, index) => (
            <React.Fragment key={index}>
              <Accordion.Title
                active={this.state.activeIndex === index}
                index={index}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                {this.state.layerListObject[subjectId].description +
                  "(" +
                  Object.keys(this.state.layerListObject[subjectId].layers)
                    .length +
                  ")"}
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndex === index}>
                {this.createLayerListItems(
                  this.state.layerListObject[subjectId].layers
                )}
              </Accordion.Content>
            </React.Fragment>
          ))}
        </Accordion>
        <Button
          id="btnShowSelectedLayers"
          onClick={() => this.props.setMode(2)}
        >
          הצג את השכבות הנבחרות
        </Button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layers: selectLayers(state),
    mapId: state.map.focused,
  };
};

export default connect(mapStateToProps)(LayerList);
