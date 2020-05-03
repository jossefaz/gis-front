export async function fetchData(properties) {

    try {
        const response = await fetch(properties.url + properties.functionName, {
            method: properties.mode,
            body: properties.body
        });

        if (!response.ok) {
            throw Error(response.statusText);
        }
        var data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.log(error);
    }
}