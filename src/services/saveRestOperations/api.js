import persistentRestService from './client'
import axios from 'axios'
export const saveRestOperation = async (url, method, payload = {}) => {
    try {
        const data = {
            url,
            method,
            payload
        }
        const newId = await persistentRestService.post("", data)
    } catch (error) {
        console.log("service unavailable")
        return null
    }


}

export const getRestOperations = async () => {
    try {
        const restOperations = await persistentRestService.get()
        restOperations.data.map(({ url, method, payload, id }) => {
            axios.request({
                method,
                url,
                data: payload
            }).then(() => deleteRestOperation(id)).catch(() => { console.log(`service : ${url} unavailable`) })
        })
        console.log(restOperations)
    } catch (error) {
        console.log("service unavailable")
    }


}

const deleteRestOperation = async (id) => {
    persistentRestService.delete(`/${id}`)
}

