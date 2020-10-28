import React, { useState, useEffect } from 'react'

import { Container, Row, Col } from 'react-bootstrap'

import ScatterPlot from '../Components/ScatterPlot'
import ScatterPlotSelection from '../Components/ScatterPlotSelection'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'


function ScatterPlotContainer(props){
  console.log("props", props)
  function processColumnData(props){
    console.log("processing data", props)
  }

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  useEffect(() => {
    processColumnData(props)
  }, [props])

  return (
    <Container>
      <Row>
        <Col sm={8}>
          <ScatterPlot data={props.data} extrema={props.extrema}/>
        </Col>
        
        <Col sm={4}> 
          <ScatterPlotSelection data={props.data}/>
        </Col>
      </Row>
    </Container>
  )
}

export default ScatterPlotContainer