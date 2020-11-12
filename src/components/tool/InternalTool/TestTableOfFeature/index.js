import React, { Component } from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import { Dropdown } from "semantic-ui-react";
import {
  selectVisibleLayers,
  selectCurrentMapLayers,
} from "../../../../redux/reducers";
import TableOfFeature from "../TableOfFeatures";
import _ from "lodash";

class GeneralTableOfFeature extends Component {
  WIDGET_NAME = "TableOfFeature";

  state = {
    layersOptions: null,
    currentLayers: null,
    currentLayerId: null,
  };

  componentDidMount() {
    if (this.props.Layers) {
      this.setState({
        currentLayers: [],
      });
    }
  }

  generateOptions = () => {
    if (this.props.Layers) {
      const layersOptions = Object.keys(this.props.Layers).map((layer) => {
        const l = this.props.Layers[layer];
        return {
          key: l.uuid,
          text: l.name,
          value: l.uuid,
        };
      });
      this.setState({ layersOptions });
    }
  };

  componentDidUpdate() {
    const areEquals = _.isEqual(
      this.state.currentLayers,
      this.props.VisibleLayers
    );
    if (!areEquals) {
      this.setState({
        currentLayers: this.props.VisibleLayers,
      });
      this.generateOptions();
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.layersOptions && (
          <Dropdown
            placeholder="layers"
            search
            selection
            options={this.state.layersOptions}
            onChange={(e, data) =>
              this.setState({ currentLayerId: data.value })
            }
          />
        )}
        {this.state.currentLayerId && (
          <TableOfFeature uuid={this.state.currentLayerId} />
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    VisibleLayers: selectVisibleLayers(state),
    Layers: selectCurrentMapLayers(state),
  };
};

export default connect(mapStateToProps)(
  withWidgetLifeCycle(GeneralTableOfFeature)
);
