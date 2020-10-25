import React from "react";
import { connect } from "react-redux";
import { toogleSideNav } from "../../redux/actions/ui";
import { renderTools } from "../../components/tool/func";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFocusedMapProxy } from "../../nessMapping/api";
class TopNav extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    //TODO implement should component update for avoiding performance issue and rerendering on every tols single change !
    console.log("nextProps", nextProps);
    console.log("nextState", nextState);

    return true;
  }
  get Tools() {
    return getFocusedMapProxy()
      ? this.props.Tools[getFocusedMapProxy().uuid.value]
      : null;
  }

  render() {
    return (
      <div className="ui top fixed menu ">
        <div className="item align left">
          <div className="ui icon input">
            <input type="text" placeholder="...חיפוש" />
            <i className="search link icon"></i>
          </div>
        </div>
        {renderTools(this.Tools, "TopNav")}
        <a
          className="ui fixed item image pointerCursor"
          onClick={() => this.props.toogleSideNav()}
        >
          <FontAwesomeIcon icon="layer-group" size="lg" />
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { toogleSideNav })(TopNav);
