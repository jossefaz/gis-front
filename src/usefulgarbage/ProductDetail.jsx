import React from 'react';
import Websocket from 'react-websocket';

class ProductDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        message: "testing web sockect"
    };
  }

  handleData(data) {
    console.log(data);
    // let result = JSON.parse(data);
     this.setState({message: data});
    //  switch (key) {
    //      <map name="()" className="channeList"></map>

             
    //          break;
     
    //      default:
    //          break;
    //  }
  }

  render() {
    return (
      <div>
        messages from yoni's web sockect: <strong>{this.state.message}</strong>

        <Websocket url='ws://172.17.22.215:9090/subscribe/events?client_id=yoni12&channel=e2&group=&subscribe_type=events'
            onMessage={this.handleData.bind(this)}/>
      </div>
    );
  }
}

export default ProductDetail;