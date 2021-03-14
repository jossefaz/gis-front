import React from "react";
import _ from "lodash";
import "./style.css";
import { connect } from "react-redux";
import UpdateMenu from "./feed";
import { selectContextMenus } from "../../state/reducers";
import REGISTRY from "./registry";
class ContextMenuContainer extends React.Component {
  state = {
    menus: null,
  };

  updateMenu = ({ type, id, properties }) => {
    UpdateMenu(type, id, properties);
  };

  componentDidMount() {
    this.props.Feature && this.updateMenu(this.props.Feature);
  }

  componentDidUpdate(prevProps) {
    this.props.Feature &&
      (!_.isEqual(prevProps.menus, this.props.menus) ||
        prevProps.Feature.id !== this.props.Feature.id) &&
      this.updateMenu(this.props.Feature);
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
            <InternalTool
              menu_config={config}
              local_config={REGISTRY[source].configuration}
              feature={this.props.Feature}
            />
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
