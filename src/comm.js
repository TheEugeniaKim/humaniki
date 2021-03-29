import urljoin from "url-join";
import { baseURL } from "./utils";

export default class humanikiAPI {
  constructor() {
    this.cache = {};
  }

  saveSnapshots(processCB) {
    // get the available snapshots ready for the application
    let snpapshotPath = "/v1/available_snapshots/";
    let snapshotURL = urljoin(baseURL, snpapshotPath);
    fetch(snapshotURL)
      .then((response) => response.json())
      .then((json) => {
        processCB(json);
      })
      .catch((error) =>
        console.error("Humaniki comm layer error inside snapshots: ", error)
      );
  }

  createPropertiesStrFromPropertyObj(propertyObj) {
    const propertiesQueriesSubArr = [];

    if (!propertyObj) {
      propertyObj = { label_lang: "en" };
    }
    if (propertyObj && !propertyObj.label_lang) {
      propertyObj.label_lang = "en";
    }

    Object.keys(propertyObj).map((key) => {
      let str = `${key}=${propertyObj[key]}`;
      propertiesQueriesSubArr.push(str);
    });

    const propertiesQuerySubStr = propertiesQueriesSubArr.join("&");
    const propertiesURLStr = `properties?${propertiesQuerySubStr}`;
    return propertiesURLStr;
  }

  makeURLFromDataPath(dataPath) {
    let urlDataPath = urljoin(
      dataPath.bias,
      dataPath.metric,
      dataPath.snapshot,
      dataPath.population
    );
    const propertiesURLStr = this.createPropertiesStrFromPropertyObj(
      dataPath.property_obj
    );
    return urljoin(baseURL, "v1", urlDataPath, propertiesURLStr);
  }

  saveToCache(url, data) {
    this.cache[url] = JSON.stringify(data);
    // return data
  }

  cacheAndReturn(data, processCB, url) {
    this.saveToCache(url, data);
    return processCB(null, data);
  }

  handleDataError(response, processCB, url) {
    const data = response.json();
    if (Object.keys(data).includes("error")) {
      processCB(data["error"], {});
    } else {
      return data;
    }
  }

  handleHTTPErrors(response, processCB, url) {
    if (response.ok) {
      return response;
    } else if (!response.ok) {
      processCB(
        {
          HTTPError: response,
          url: url,
        },
        {}
      );
    }
  }

  handleUnreachable(unreachableError, processCB, url) {
    processCB({ Unreachable: url }, {});
  }

  getJSONFromURL(url, processCB) {
    fetch(url)
      // alert the user if the network is down/unavaile
      .then((response) => this.handleHTTPErrors(response, processCB, url))
      .then((response) => this.handleDataError(response, processCB, url))
      .then((data) => this.cacheAndReturn(data, processCB, url))
      .catch((unreachableError) =>
        this.handleUnreachable(unreachableError, processCB, url)
      );
  }

  get(dataPath, processCB) {
    const url = this.makeURLFromDataPath(dataPath);
    // try using cache
    if (this.cache[url]) {
      processCB(null, JSON.parse(this.cache[url]));
    } else {
      try {
        this.getJSONFromURL(url, processCB);
      } catch (e) {
        console.error("Humaniki comm layer error inside metrics get: ", e);
      }
    }
  }
}
