import React from 'react';
import Map from "../components/UI/Map";
import TopNav from "../components/UI/TopNav";
import SideNav from "../components/UI/SideNav";



class App extends React.Component {
  state = {
    visible: false
  }

  onLayerMenuOpen = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }));
  render() {
    return (



      <SideNav visible={this.state.visible} onLayerMenuOpen={this.onLayerMenuOpen}>
        <div className="ui grid">
          <div className="row">
            <TopNav onLayerMenuOpen={this.onLayerMenuOpen} />
          </div>
          <div className="row">
            <TopNav onLayerMenuOpen={this.onLayerMenuOpen} />
            <Map />

          </div>
        </div>
      </SideNav>


    );
  }
}

export default App;

