import React from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import "./style.css";
const Identify = (props) => {
  return (
    <div className="ui grid">
      <FeatureList />
      <FeatureDetail />
    </div>
  );
};

export default Identify;
