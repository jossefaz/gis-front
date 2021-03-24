import { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";
import LayerListMenuItem from "../LayerListMenuItem";
import { selectLayers } from "../../../state/selectors/layersSelector";

class LayerListMenuItemEx extends Component {
  render() {
    const { layer } = this.props;

    return (
      <div className="uirtl">
        <div className="stickingOutText">{layer.name}</div>
        <LayerListMenuItem layerId={layer.uuid}></LayerListMenuItem>
        <div className="padding">
          {" "}
          <Icon
            link
            onClick={() => this.props.setMode(2)}
            size="large"
            name="redo"
          />
          חזור לשכבות פעילות
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    layer: selectLayers(state)[ownProps.layerId],
  };
};

export default connect(mapStateToProps, {})(LayerListMenuItemEx);
