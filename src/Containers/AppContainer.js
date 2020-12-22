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


    function handleNetworkErrors(response, props) {
        if (response.ok) {
            // console.log('Reponse was ok')
        } else if (!response.ok) {
            // console.log('Response error is :', response)
            processCB('NetworkError', {})
        }
        return response
    }


    function getJSONFromURL(url) {
        console.log('getting URL,', url)
        fetch(url)
            // alert the user if the network is down/unavaile
            .then(handleNetworkErrors)
            .then((response) => {
                response.json()
                    .then((data) =>
                            // check if the data had explicit errors
                        {
                            if (Object.keys(data).includes("error")) {
                                processCB(data['error'], {})
                            } else {
                                processCB(null, data)
                            }
                        }
                    )
                    // catch anything else
                    .catch((error) => processCB(error, {}))
            })
    }


    const fetchURL = makeURLFromDataPath(dataPath)
    try {
        getJSONFromURL(fetchURL)
    } catch (e) {
        console.error('Catching e')
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
