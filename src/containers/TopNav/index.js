import React from "react";
import { connect } from "react-redux";
import { toogleSideNav } from "../../redux/actions/ui";
import { renderTools } from "../../components/tool/func";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFocusedMapProxy } from "../../nessMapping/api";
import SeachComp from "../../components/Search";
class TopNav extends React.Component {
  get Tools() {
    return getFocusedMapProxy()
      ? this.props.Tools[getFocusedMapProxy().uuid.value]
      : null;
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
