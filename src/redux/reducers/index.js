import { combineReducers } from 'redux'
import mapLayers from './mapLayers'
import mantiSystems from './mantiSystems'
import filter from './filter'

export default combineReducers({
    mapLayers,
    mantiSystems,
    // filter
})  
