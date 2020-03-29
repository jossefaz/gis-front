import React, { Component } from "react";
import { MDBContainer, MDBNotification } from "mdbreact";

class Notification extends Component {
  render() {
    return (
      <MDBContainer className="grey darken-3 p-3">
        <MDBNotification
          iconClassName="text-primary"
          show
          fade
          title="Bootstrap"
          message="Hello, world! This is a toast message."
          text="11 mins ago"
        />
      </MDBContainer>
    );
  }
}

export default Notification;