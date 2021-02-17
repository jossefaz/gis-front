import React from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../../redux/actions/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFocusedMapProxy } from '../../../nessMapping/api'

class Loader extends React.Component {
  get Tools() {
    const currentMapId = getFocusedMapProxy() ? getFocusedMapProxy().uuid.value : null
    return currentMapId ? this.props.Tools[currentMapId] : null
  }
  render() {
    const { ToolName, ToolImage, ToolIcon } = this.Tools.tools[
      this.props.ToolID
    ];
    const ToggleCB = () => this.props.toggleTool(this.props.ToolID);
    return (
      <a className="item" onClick={ToggleCB}>
        {ToolIcon ? (
          <FontAwesomeIcon icon={ToolIcon} size="2x" />
        ) : ToolImage ? (
          <img src={`/img/${ToolImage}`} />
        ) : (
              ToolName
            )}
      </a>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleTool })(Loader);
