import React, { FunctionComponent } from "react";
import Map from 'ol/Map' 
import View from 'ol/View';
import Projection from 'ol/proj/Projection';
import {TileWMS,OSM,WMTS,Tile, Vector as VectorSource,TileImage} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { Component } from 'react'




export interface MapProps {
    map : Map
}

export const MapObject: FunctionComponent<MapProps> = ({   
    
    map
  }) => (
     <div id="map">{map}</div>
); 
