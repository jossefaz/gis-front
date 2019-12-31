import React from 'react';
import { Event } from 'react-socket-io';
 
export default class testIO extends React.Component {
    constructor(props) {
        super(props);
        this.onMessage = this.onMessage.bind(this);
    }
 
    onMessage(message) {
        console.log(message);
    }
 
    render() {
        return (
            <div>
                <h1>SocketIO Test.</h1>
                <Event event='client_id=yoni12&channel=e2&group=&subscribe_type=events' handler={this.onMessage} />
            </div>
        );
    }
}