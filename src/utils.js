import React from 'react'
import { textFilter } from 'react-bootstrap-table2-filter'
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { Alert } from 'react-bootstrap'

//gender color map see single bar chart component
export const colors = ["#F19359","#517FC1","#FAD965"]

export const genderColorsMap = {male: "#517FC1", female: "#F19359", sumOtherGenders: "#FAD965"}

export const populations = {
  ALL_WIKIDATA: "all_wikidata",
  GTE_ONE_SITELINK: "gte_one_sitelink"
}

export const QIDs = {
  female: "6581072",
  male: "6581097"
}

export const keyFields = {
  dob: "year",
  language: "language",
  country: "country",
  search: "data fields"
}

export const baseURL = process.env.REACT_APP_API_URL

export const loadingDiv = <Alert variant="warning">Loading</Alert>

export function filterMetrics(metrics, filterFn){
  return metrics.filter(metric => filterFn(metric));
}

export function formatDate(date) {
  return (
    date.substring(0, 4) +
    "-" +
    date.substring(4, 6) +
    "-" +
    date.substring(6, 8)
  );
}

export function percentFormatter(cell, row){
  if (!cell){
    return
  }
  return cell.toFixed(3)+"%"
}

function thousandSeparator(cell){
  return Number(cell).toLocaleString()
}

export function createColumns(meta, metrics, indexColTitle, gapCol=null ){
  const columns = []
    //column order: 
    // 1. index 
    // 2. total
    // 3. binary genders
    // 4. sum of nonbinary genders 
    // 5. nonbinary genders 
    if (gapCol) {
      columns.push({dataField: indexColTitle, text: indexColTitle.toUpperCase(), filter: textFilter({placeholder: "Search"}), sort: true})
    } else {
      columns.push({dataField: indexColTitle, text: indexColTitle.toUpperCase(), filter: textFilter(), sort: true})
    }
    columns.push({dataField: "total",text: "Total", formatter: thousandSeparator, sort: true})
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.female],
        text: meta.bias_labels[QIDs.female],
        formatter: thousandSeparator,
        sort: true,
        classes: "gender-col gender-col-female"
      }
    )
    if (gapCol){
      columns.push({dataField: "gap", text: "Gap", sort: true, headerStyle: {
        "overflow": 'visible',
        "minWidth": "200px", 
        "width": "20%"
      }})
    }
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.female] + "Percent",
        text: meta.bias_labels[QIDs.female] + " Percent",
        formatter: percentFormatter,
        sort: true,
        classes: "gender-col gender-col-percent-female"
      }
    )
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.male],
        text: meta.bias_labels[QIDs.male],
        formatter: thousandSeparator,
        sort: true,
        classes: "gender-col gender-col-male"
      }
    )
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.male] + "Percent",
        text: meta.bias_labels[QIDs.male] + " Percent",
        sort: true,
        formatter: percentFormatter,
        classes: "gender-col gender-col-percent-male"
      }
    )
    columns.push({dataField: "sumOtherGenders", text: "∑ Other Genders", formatter: thousandSeparator, sort: true, classes: "gender-col gender-col-sum-other" })
    columns.push({dataField: "sumOtherGendersPercent", text: "∑ Other Genders Percent", sort: true, formatter: percentFormatter, classes: "gender-col gender-col-percent-sum-other"})

    for (let genderId in meta.bias_labels) {
      if (genderId !==QIDs.female && genderId !==QIDs.male){
        // check if bias label exists else use QID
        let biasLabel = meta.bias_labels[genderId] ? meta.bias_labels[genderId] : genderId
        let obj = {

          dataField: biasLabel ,
          text: biasLabel,
          label: biasLabel,
          sort: true,
          hidden: true
        }
        let objPercent = {
          dataField: biasLabel + "Percent",
          text: biasLabel + " Percent",
          label: biasLabel + " Percent",
          sort: true,
          formatter: percentFormatter,
          hidden: true
        }
        columns.push(obj)
        columns.push(objPercent)
      }
    }
    
  return columns 
}

// Helper to MultiSelectDropdown Component
export const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  )
}

// Helper to MultiSelectDropdown Component
export const MultiValue = (props) => {
  let labelToBeDisplayed = `${props.data.label}, `
  if (props.data.value === selectAllOption.value){
    labelToBeDisplayed = "All Selected"
  }
  return (
    <components.MultiValue {...props}>
      <span>{labelToBeDisplayed}</span>
    </components.MultiValue>
  )
}

// Helper to MultiSelectDropdown Component
export const ValueContainer = ({children, ...props}) => {
  const currentValues = props.getValue()
  let labelToBeRendered = children
  if (currentValues.some(v => v.value === selectAllOption.value)){
    labelToBeRendered = [[children[0][0]], children[1]]
  }

  return (
    <components.ValueContainer {...props}>
      {labelToBeRendered}
    </components.ValueContainer>
  )
}

// Helper to MultiSelectDropdown Component
export const animatedComponents = makeAnimated();

// Helper to MultiSelectDropdown Component
export const selectAllOption = {
  label: "Select All",
  value: "*"
}