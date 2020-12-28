import urljoin from "url-join";
import { baseURL } from "./utils";

export default class humanikiAPI{
    constructor() {
        this.cache = {}
    }

    saveSnapshots(processCB) {
        // get the available snapshots ready for the application
        let snpapshotPath = '/v1/available_snapshots/'
        let snapshotURL = urljoin(baseURL, snpapshotPath)
        fetch(snapshotURL)
            .then((response) => response.json())
            .then((json) => {
                processCB(json)
            })
            .catch((error) => console.error('Could not get snapshots because of ', error))
    }

    createPropertiesStrFromPropertyObj(propertyObj){
        const propertiesQueriesSubArr = []
        
        if (!propertyObj) {
            propertyObj = {label_lang: "en"}
        }
        if (propertyObj && !propertyObj.label_lang){
            propertyObj.label_lang = "en"
        }

        Object.keys(propertyObj).map(key => {
            let str = `${key}=${propertyObj[key]}`
            propertiesQueriesSubArr.push(str)
        })
        
        const propertiesQuerySubStr = propertiesQueriesSubArr.join("&")
        const propertiesURLStr = `properties?${propertiesQuerySubStr}`
        return propertiesURLStr
    }

    makeURLFromDataPath(dataPath) {
        let urlDataPath = urljoin(dataPath.bias, dataPath.metric, dataPath.snapshot, dataPath.population)
        const propertiesURLStr = this.createPropertiesStrFromPropertyObj(dataPath.property_obj)
        return urljoin(baseURL, "v1", urlDataPath, propertiesURLStr)
    }

    handleNetworkErrors(response, processCB) {
        if (response.ok) {
        } else if (!response.ok) {
            processCB('NetworkError', {})
        }
        return response
    }

    saveToCache(url, data) {
        this.cache[url] = data
        return data
    }

    getJSONFromURL(url, processCB) {
        fetch(url)
            // alert the user if the network is down/unavaile
            .then((response) => this.handleNetworkErrors(response, processCB))
            .then((response) => {
                response.json()
                    .then((data) =>
                            // check if the data had explicit errors
                        {
                            if (Object.keys(data).includes("error")) {
                                processCB(data['error'], {})
                            } else {
                                this.cache[url] = JSON.stringify(data)
                                // this.cache[url] = Promise.resolve(data)
                                processCB(null, data)
                            }
                        }
                    )
                    // catch anything else
                    .catch((error) => processCB(error, {}))
            })
    }

    get(dataPath, processCB) {
        const url = this.makeURLFromDataPath(dataPath)
        // try using cache
        if (this.cache[url]) {
            processCB(null, JSON.parse(this.cache[url]))
        } else {
            try {
                this.getJSONFromURL(url, processCB)
            } catch (e) {
                console.error('Catching e')
            }
        }
    }
}