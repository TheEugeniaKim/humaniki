import urljoin from "url-join";
import React from 'react'

export default class humanikiAPI{
    constructor() {
        this.cache = {}
    }

    saveSnapshots(processCB) {
        // get the available snapshots ready for the application
        let baseURL = process.env.REACT_APP_API_URL
        let snpapshotPath = '/v1/available_snapshots'
        let snapshotURL = urljoin(baseURL, snpapshotPath)
        fetch(snapshotURL)
            .then((response) => response.json())
            .then((json) => {
                processCB(json)
            })
            .catch((error) => console.error('Could not get snapshots because of ', error))
    }

    makeURLFromDataPath(dataPath) {
        let baseURL = process.env.REACT_APP_API_URL
        // console.log("IN DATA PATH", dataPath, baseURL)
        let urlDataPath = urljoin(dataPath.bias, dataPath.metric, dataPath.snapshot, dataPath.population)
        const propertiesQueriesSubArr = []
        if (dataPath.property_obj) {
            Object.keys(dataPath.property_obj).map(key => {
                let str = `${key}=${dataPath.property_obj[key]}`
                propertiesQueriesSubArr.push(str)
            })
        }
        const propertiesQuerySubStr = propertiesQueriesSubArr.join("&")
        const propertiesURLStr = `properties?${propertiesQuerySubStr}`
        return urljoin(baseURL, "v1", urlDataPath, propertiesURLStr)
    }


    handleNetworkErrors(response, processCB) {
        if (response.ok) {
            // console.log('Reponse was ok')
        } else if (!response.ok) {
            // console.log('Response error is :', response)
            processCB('NetworkError', {})
        }
        return response
    }

    saveToCache(url, data) {
        this.cache[url] = data
        console.log('saving data', data)
        return data
    }


    getJSONFromURL(url, processCB) {
        // console.log('getting URL,', url)
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