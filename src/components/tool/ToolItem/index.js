import React from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../../state/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../../../core/api";

class Loader extends React.Component {
  get Tools() {
    const currentMapId = API.map.getFocusedMapUUID();
    return currentMapId ? this.props.Tools[currentMapId] : null;
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
