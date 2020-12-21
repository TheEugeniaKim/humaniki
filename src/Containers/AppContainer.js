import React, {useState, useEffect} from 'react'
import NavBarComponent from '../Components/NavBarComponent'
import Footer from '../Components/Footer'
import DefaultView from '../Views/DefaultView'
import AboutView from '../Views/AboutView'
import AdvancedSearchView from '../Views/AdvancedSearchView'
import GenderByCountryView from '../Views/GenderByCountryView'
import GenderByDOBView from '../Views/GenderByDOBView'
import GenderByLanguageView from '../Views/GenderByLanguageView'
import {Container} from 'react-bootstrap'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import urljoin from 'url-join'

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

// bias, metric, snapshot, population, {citizenship: "all"}, + label_lang=en
//{bias: "gender", 
// metric: "gap",
// snapshot: "latest",
// population: "gte_one_sitelink",
// property_obj: null, 
// label_lang: "en"
//}

function getAPI(dataPath, processCB) {
    let err = null

    function makeURLFromDataPath(dataPath) {
        let baseURL = process.env.REACT_APP_API_URL
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
        let fetchURL = urljoin(baseURL, "v1", urlDataPath, propertiesURLStr)
        return fetchURL
    }


    function getJSONFromURL(url) {
        fetch(url).then(response => {
            if (response.status == 200) {
                return response.json()
            } else {
                throw new HttpError(response)
            }
        })
            .catch(e => {
                handleNetworkErrors(e, processCB)
            })
    }


    const fetchURL = makeURLFromDataPath(dataPath)

    getJSONFromURL(fetchURL)
        .then(json => processCB(err, json))
        .catch(anErr => {
                // debugger
                err = anErr
                handleHTTPErrors(anErr, processCB)
            }
        )

    function handleNetworkErrors(anErr, processCB) {
        console.error('Network Error', anErr)
        processCB(anErr, processCB)
    }

    function handleHTTPErrors(anErr, processCB) {
        if (Object.keys(anErr).includes("response")) {
            if (anErr.response.status == 500) {
                console.error("The server is down contact Humaniki team")
            } else if (anErr.response.status == 503) {
                console.error("Please try again soon")
            } else if (400 <= anErr.response.status < 500) {
                console.error("I was programmed incorrectly! (Or the backend was)")
            } else {
                console.error("An error that never got a reponse: ", anErr)
            }
        }
        processCB(anErr, {})
    }
}


function AppContainer() {
    const [navBar, setNavBar] = useState("about")

    return (
        <div className="App">
            <NavBarComponent setNavBar={setNavBar}/>
            <Router>
                <Route exact path={"/"} render={() => <DefaultView getAPI={getAPI}/>}/>
                <Route exact path={"/about"} render={() => <AboutView/>}/>
                <Route exact path={"/advanced-search"} render={() => <AdvancedSearchView/>}/>
                <Route exact path={"/gender-by-country"} render={() => <GenderByCountryView/>}/>
                <Route exact path={"/gender-by-dob"} render={() => <GenderByDOBView/>}/>
                <Route exact path={"/gender-by-language"} render={() => <GenderByLanguageView/>}/>
            </Router>
            <Container>
                <Footer className="fixed-bottom"/>
            </Container>
        </div>
    );
}

export default AppContainer;
