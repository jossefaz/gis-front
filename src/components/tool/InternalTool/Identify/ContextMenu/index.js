import React from "react";
import axios from "axios";
import _ from "lodash";
import "./style.css";
class FeatureDetail extends React.Component {
  state = {
    menus: null,
  };

  updateMenu = async () => {
    const response = await axios.get(
      'http://meitarimds:5002/api/BankPkudot/groupBy?filter={"AdaptorId": "MTCS", "category": "Cmd_SystemActivate"}&MENU_TYPE=BY_LAYERID'
    );
    this.setState({ menus: response.data });
  };

  componentDidMount() {
    this.props.Feature && this.updateMenu();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextState.menus, this.state.menus) ||
      nextProps.Feature.id !== this.props.Feature.id
    );
  }

  componentDidUpdate() {
    this.props.Feature && this.updateMenu();
  }

  render() {
    return (
      this.props.Feature &&
      this.state.menus && (
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
              <tbody className="scrollContent"></tbody>
            </table>
          </div>
        </React.Fragment>
      )
    );
  }
}

export default FeatureDetail;
