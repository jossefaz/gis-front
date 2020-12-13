import React, { Suspense } from "react";
import _ from "lodash";
import "./style.css";
import { connect } from "react-redux";
import UpdateMenu from "./feed";
import { selectContextMenus } from "../../redux/reducers";
import REGISTRY from "./registry";
class ContextMenuContainer extends React.Component {
  state = {
    menus: null,
  };

  componentDidMount() {
    this.props.Feature &&
      UpdateMenu(this.props.Feature.type, this.props.Feature.id);
  }

  componentDidUpdate(prevProps) {
    this.props.Feature &&
      (!_.isEqual(prevProps.menus, this.props.menus) ||
        prevProps.Feature.id !== this.props.Feature.id) &&
      UpdateMenu(this.props.Feature.type, this.props.Feature.id);
  }

  renderMenu(source, config) {
    const InternalTool = REGISTRY[source].component;

    return (
      source in this.props.menus &&
      this.props.Feature.id in this.props.menus[source] &&
      this.props.menus[source][this.props.Feature.id].length > 0 && (
        <tr key={source}>
          <td>
            <b>{source}</b>
          </td>
          <td>
            <InternalTool config={config} />
          </td>
        </tr>
      )
    );
  }

  render() {
    return (
      this.props.Feature &&
      this.props.menus && (
        <React.Fragment>
          <div onMouseDownCapture={(e) => e.stopPropagation()}>
            <table className="ui celled table">
              <thead>
                <tr>
                  <th className="details-header">
                    <div>Menu</div>
                  </th>
                </tr>
              </thead>
              <tbody className="scrollContent">
                {Object.keys(this.props.menus).map((source) => {
                  return this.renderMenu(
                    source,
                    this.props.menus[source][this.props.Feature.id]
                  );
                })}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      )
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menus: selectContextMenus(state),
  };
};

export default connect(mapStateToProps)(ContextMenuContainer);
