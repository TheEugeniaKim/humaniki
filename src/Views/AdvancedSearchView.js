import React, {useState} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { ToggleButtonGroup, ToggleButton, Form } from 'react-bootstrap'
import RadialBarChart from '../Components/RadialBarChartButton'


function AdvancedSearchView(){
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState("all")

  function handleHumanChange(event){
    if (event === "all") {
      setSelectedWikipediaHumanType("all-wikidata")
    } else if (event === "at-least-one") {
      setSelectedWikipediaHumanType("at-least-one")
    } else if (event === "more-than-one") {
      setSelectedWikipediaHumanType("more-than-one")
    }
  }

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  const columns = [{
      dataField: "total", 
      text: "Total", 
      filter: textFilter()
    },{
      dataField: "totalWithGender", 
      text: "Total With Gender", 
      filter: textFilter()
    }, {
      dataField: "women", 
      text: "Women", 
      filter: textFilter()
    }, { 
      dataField: "womenPercent", 
      text: "Women Percent", 
      filter: textFilter()
    }, {
      dataField: "gap", 
      text: "Gap", 
      filter: textFilter()
    }, {
      dataField: "men", 
      text: "Men", 
      filter: textFilter()
    }, {
      dataField: "menPercent", 
      text: "Men Percent", 
      filter: textFilter()
    }

  ]

  return (
    <div>
      Advanced Search

      <div className="human-div">
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

      <BootstrapTable 
        keyField='total' 
        // data={ tableArr } 
        columns={ columns } 
        filter={ filterFactory({ afterFilter }) } 
        pagination={ paginationFactory(10) }
      />
      
    </div>
  )
}

export default AdvancedSearchView