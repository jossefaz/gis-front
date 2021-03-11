import React from "react";
import { connect } from "react-redux";
import { toogleSideNav } from "../../state/actions/ui";
import { renderTools } from "../../components/tool/RenderTool";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../../core/api";
import SeachComp from "../../components/Search";
class TopNav extends React.Component {
  get Tools() {
    const currentMapUUID = API.map.getFocusedMapUUID();
    return currentMapUUID ? this.props.Tools[currentMapUUID] : null;
  }

  render() {
    return (
      <div className="ui top fixed menu ">
        <div className="item align left">
          <SeachComp />
        </div>
        {renderTools(this.Tools, "TopNav")}
        <button
          className="ui fixed item image pointerCursor"
          onClick={() => this.props.toogleSideNav()}
        >
          <FontAwesomeIcon icon="layer-group" size="lg" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { toogleSideNav })(TopNav);
