import React from "react";
import { connect } from "react-redux";
import { toogleSideNav } from "../../redux/actions/ui";
import { renderTools } from "../../components/tool/func";
class TopNav extends React.Component {
  render() {
    return (
      <div className="ui top fixed menu ">
        <div className="item align left">
          <div className="ui icon input">
            <input type="text" placeholder="...חיפוש" />
            <i className="search link icon"></i>
          </div>
        </div>
        {renderTools(this.props.Tools, "TopNav")}
        <a
          className="ui fixed item image pointerCursor"
          onClick={() => this.props.toogleSideNav()}
        >
          <img src={`/img/Layers.png`} />
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { toogleSideNav })(TopNav);
