import config from "react-global-configuration"
import configFile from "./config.json"
import mockData from './mockData.json'
export const fetchConfig = () => {
    try {
        config.set(Object.assign(configFile, mockData), { freeze: false })
        return true
    } catch (error) {
        return false
    }
}
