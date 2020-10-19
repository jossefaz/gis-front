import axios from 'axios'

export const baseURL = "http://localhost:9090/persistentGeometry";
export default axios.create({
    baseURL,
    headers: {
        Authorization: "Any Auth Token"
    },
})