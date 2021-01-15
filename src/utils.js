import { textFilter } from 'react-bootstrap-table2-filter'
//gender color map see single bar chart a
export const colors = ["#BC8F00","#6200F8","#00BCA1"]

export const populations = {
  ALL_WIKIDATA: "all_wikidata",
  GTE_ONE_SITELINK: "gte_one_sitelink"
}

export const baseURL = process.env.REACT_APP_API_URL

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
  return cell.toFixed(3)
}

export function createColumns(meta, metrics, indexColTitle, gapCol=null){
  const columns = []
    columns.push({dataField: indexColTitle, text: indexColTitle.toUpperCase(), filter: textFilter()})
    columns.push({dataField: "total",text: "Total", sort: true})
    columns.push({dataField: "sumOtherGenders", text: "∑ Other Genders", sort: true})
    columns.push({dataField: "sumOtherGendersPercent", text: "∑ Other Genders Percent", sort: true, formatter: percentFormatter})
    for (let genderId in meta.bias_labels) {
      let obj = {
        dataField: meta.bias_labels[genderId],
        text: meta.bias_labels[genderId],
        sort: true
      }
      let objPercent = {
        dataField: meta.bias_labels[genderId] + "Percent",
        text: meta.bias_labels[genderId] + " Percent",
        sort: true,
        formatter: percentFormatter
      }
      if (genderId !=="6581097" && genderId !=="6581072"){
        obj.hidden = true
        objPercent.hidden = true
      }
      obj.label = meta.bias_labels[genderId]
      columns.push(obj)
      columns.push(objPercent)
    }
  return columns 
}

