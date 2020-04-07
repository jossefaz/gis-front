import React from "react";
import { Input, Menu } from "semantic-ui-react";

const TopNav = (props) => (
  <div className="ui top fixed menu ">
    <div className="item align left">
      <div className="ui icon input">
        <input type="text" placeholder="...חיפוש" />
        <i className="search link icon"></i>
      </div>
    </div>
    <a className="fixed item" onClick={() => props.onLayerMenuOpen()}>
      Layers
    </a>
  </div>
);

export default TopNav;
