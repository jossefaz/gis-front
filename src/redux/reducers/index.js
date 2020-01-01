import { combineReducers } from 'redux'
import mapLayers from './mapLayers'
import featureAttributes from './featureAttributes'

export default combineReducers({
    mapLayers,
    featureAttributes
})  
