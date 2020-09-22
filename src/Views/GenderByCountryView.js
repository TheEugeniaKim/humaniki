import React, { useState, useEffect } from 'react'
import WorldMap from '../Components/WorldMap'
import data from '../Components/WorldData.geo.json'
import { ToggleButtonGroup, ToggleButton, useAccordionToggle } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import RadialBarChart from '../Components/RadialBarChartButton'
import { propTypes } from 'react-bootstrap/esm/Image';


function GenderByCountryView(props){
  const [selectBirthVsCitizenship, setBirthVsCitizenship] = useState("country-of-birth")
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState("all")
  const tableData = [{
    id: 1, 
    country:"United States", 
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 23423,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }, {
    id: 2, 
    country: "Canada",
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 28,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }]
  const columns = [{
    dataField: "country",
    text: "Country"
  }, {
    dataField: "total",
    text: "Total"
    
  }, {
    dataField: "totalWithGender",
    text: "Total With Gender"
  }, {
    dataField: "women",
    text: "Women"
  }, {
    dataField: "WomenPercent",
    text: "Women (%)"
  }, {
    dataField: "men",
    text: "Men"
  }, {
    dataField: "MenPercent",
    text: "Men (%)"
  }, {
    dataField: "nonBinary",
    text: "Non-binary"
  }, {
    dataField: "nonBinaryPercent",
    text: "Non-Binary (%)"
  }]

  function handleChange(event){
    if (event === "birth") {
      setBirthVsCitizenship("country-of-birth")
    } else if (event === "citizenship") {
      setBirthVsCitizenship("country-of-citizenship")
    }
  }

  function handleHumanChange(event){
    console.log("Handle Human Change", event)
    if (event === "all") {
      setSelectedWikipediaHumanType("all")
    } else if (event === "at-least-one") {
      setSelectedWikipediaHumanType("at-least-one")
    } else if (event === "more-than-one") {
      setSelectedWikipediaHumanType("more-than-one")
    }
  }

  const MySearch = (props) => {
    let input
    const handleClick = () => {
      props.onSearch(input.value);
  }

    return (
      <div>
        <input
          className="form-control"
          style={ { backgroundColor: 'pink' } }
          ref={ n => input = n }
          type="text"
        />
        <button className="btn btn-warning" onClick={ handleClick }>Click to Search!!</button>
      </div>
    );
  };

  return (
    <div>
      <h1>Gender Gap By Country</h1>
      <h5>This will be the description of the plot data that's represented below</h5>
      
      <div className="input-area">
        <div>
          <p style={{border: "2px solid"}}>
            Note: As for January, 2016, only about 30% of biographies had place
            of birth, so this data is incomplete.
          </p>
        </div>

        <h6>Data Selection</h6>
          <ToggleButtonGroup type="radio" name="birthVsCitizenship" defaultValue={"birth"} onChange={handleChange}>
            <ToggleButton value={"birth"} name="birth" variant="outline-dark">Country of Birth</ToggleButton>
            <ToggleButton value={"citizenship"} name="citizenship" variant="outline-dark">Country of Citizenship</ToggleButton>
          </ToggleButtonGroup>  

          <br/>
        <h6>Different Wikipedia Categories of Humans</h6>
          <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
            <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark"> 
              <RadialBarChart 
                width={70} 
                height={70} 
                outerRadius={35} 
                innerRadius={25}
                data={[{label:"men", value: 69},{label: "non-binary", value:1},{label: "women", value: 30}]}
              /> 
              All Humans on Wikidata
            </ToggleButton>
            <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">
              <RadialBarChart 
                width={70} 
                height={70} 
                outerRadius={35} 
                innerRadius={25}
                data={[{label:"men", value: 69},{label: "non-binary", value:1},{label: "women", value: 30}]}
              /> 
              Humans With Atleast One Wikipedia Article
            </ToggleButton>
            <ToggleButton value={"more-than-one"} name="at-least-one" size="lg" variant="outline-dark">
              <RadialBarChart 
                width={70} 
                height={70} 
                outerRadius={35} 
                innerRadius={25}
                data={[{label:"men", value: 69},{label: "non-binary", value:1},{label: "women", value: 30}]}
              /> 
              Humans With More Than One Wikipedia Article
            </ToggleButton>
          </ToggleButtonGroup>

        
      </div>      

      <WorldMap data={data} />

      <MySearch {...props.searchProps} />
      <BootstrapTable className=".table-striped" keyField="id" data={tableData} columns={columns} />

    </div>

  )
}

export default GenderByCountryView 