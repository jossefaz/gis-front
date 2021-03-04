import React, { Component } from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy } from "../../../../core/api";
import { setSelectedFeatures } from "../../redux/actions/features";
import { InteractionUtil } from "../interactions";
import { OverlayUtil } from "../overlay";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import "./style.css";

class MyCustomWidget extends Component {
  // Some action of tool reducers need the widget name as a parameter...
  // Its always a good practice to write it only once and access it further by calling this.WIDGET_NAME
  // this avoids typo errors
  WIDGET_NAME = "PUT HERE THE WIDGET NAME";

  constructor() {
    super();
    // If the widget need interactions with the map or add overlays on it, use the special InteractionUtil and OverlayUtil classes
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.overlays = new OverlayUtil(this.WIDGET_NAME);
  }

  //EXAMPLE of NessMapping API USE
  get focusedMapUUID() {
    return getFocusedMapProxy().uuid.value;
    //Now you can access this property by doing : this.focusedMapUUID
  }

  componentDidMount() {
    // Example of adding a draw interaction to the map
    this.interactions.newDraw({ type: "Polygon" });

    // Put here the logic when the Widget Component mounted to the DOM
  }

  onReset = () => {
    // Put here the logic when the user switched map : you could alert the user before switching map to save aany data
  };

  onUnfocus = () => {
    // Put here the logic when the user click on another widget an this one will be unfocused :
    // For example, if you add Interaction to the map, this is the place to remove those interaction in order to let the others
    // widget to add their own interactions
  };

  onFocus = async () => {
    // Put here the logic when the user click on this widget window :
    // For example, this is the place to add interactions, layers, overlays to the map
  };

  componentWillUnmount() {
    // Put here the logic when the user close the widget window :
    // For example this is a good place to alert the user from saving data or keep any state
  }

  render() {
    return <React.Fragment>{/* JSX code goes here */}</React.Fragment>;
  }
}
const mapStateToProps = (state) => {
  return {
    // Write here which part of the Redux Global State you need. Whenever this part of the state change, the widget will rerender
    // Here for example I call the property "Interaction" of the state, i could now access to int in my component code by doing "this.props.Interaction"
    Interactions: state.Interactions,
  };
};

// This object will connect a redux action to the component
const mapDispatchToProps = { setSelectedFeatures };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  //Here We call the HOC withWidgetLifeCycle in order to make him taking care of the lifecycle method of a widget (onFocus, onUnfocus, onReaset...etc) that we previously defined
  withWidgetLifeCycle(MyCustomWidget)
);
