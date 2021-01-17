import React, { useState } from "react";
import { Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import ToolkitProvider, {
  ColumnToggle,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import filterFactory, { afterFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

function GenderTable({ tableColumns, tableArr }) {
  const [showExpandGenders, setShowExpandGenders] = useState(false);
  const { ExportCSVButton } = CSVExport;
  const { ToggleList } = ColumnToggle;

  const CustomToggleList = ({ columns, onColumnToggle, toggles }) => (
    <div
      className="btn-group btn-group-toggle btn-group-vertical"
      data-toggle="buttons"
    >
      {columns
        .map((column) => ({
          ...column,
          toggle: toggles[column.dataField],
        }))
        .map((column) => (
          <button
            type="button"
            key={column.dataField}
            className={`btn btn-warning ${column.toggle ? "active" : ""}`}
            data-toggle="button"
            aria-pressed={column.toggle ? "true" : "false"}
            onClick={() => onColumnToggle(column.dataField)}
          >
            {column.text}
          </button>
        ))}
    </div>
  );

  function handleGenderExpandClick(event) {
    setShowExpandGenders(!showExpandGenders);
  }

  if (tableColumns.length>0){
    return (
      <ToolkitProvider
        keyField="year"
        data={tableArr}
        columns={tableColumns}
        columnToggle
        exportCSV
      >
        {(props) => (
          <div>
            {/* <ExportCSVButton { ...props.csvProps }> Export CSV!! </ExportCSVButton> */}
            <div className="expand-genders">
              <Button onClick={handleGenderExpandClick}>
                {showExpandGenders ? "Hide" : "Show"} Other Genders Breakdown
              </Button>
              {showExpandGenders ? (
                <CustomToggleList {...props.columnToggleProps} />
              ) : null}
            </div>
            <BootstrapTable
              {...props.baseProps}
              filter={filterFactory({ afterFilter })}
              pagination={paginationFactory()}
              striped
              condensed
            />
          </div>
        )}
      </ToolkitProvider>
      
    ) 
  } else {
    // don't display if there are no tableColumns
    return null
  }
}

export default GenderTable;
