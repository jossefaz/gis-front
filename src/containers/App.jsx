import React from 'react';
import Map from "../containers/Map";
import TopNav from "../containers/TopNav";
import SideNav from "../containers/SideNav";



class App extends React.Component {

  render() {
    return (
      <SideNav>
        <div className="ui grid">
          <div className="row">
            <TopNav onLayerMenuOpen={this.onLayerMenuOpen} />
          </div>
          <div className="row">
            <Map />
          </div>
        </div>
      </SideNav>
    );
  }
}

export default App;

