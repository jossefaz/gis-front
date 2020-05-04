import React from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import LayersList from "./LayersList";
import "./style.css";
const Identify = (props) => {
  return (
    <div className="ui grid">
      <FeatureDetail />
      <FeatureList />
      <LayersList />

    </div>
  );
};

export default Identify;
