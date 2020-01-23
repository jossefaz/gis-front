import { combineReducers } from 'redux'
import mapLayers from './mapLayers'
import featureAttributes from './featureAttributes'
import filter from './filter'

export default combineReducers({
    mapLayers,
    featureAttributes,
    filter
})  
