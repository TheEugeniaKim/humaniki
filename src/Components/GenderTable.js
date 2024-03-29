import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ModalComponent from "../Components/ModalComponent";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, { afterFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

function GenderTable({ tableColumns, tableArr, keyField, defaultSorted }) {
  const [modalShow, setModalShow] = useState(false);
  const [myToggles, setMyToggles] = useState({ male: true });

  const paginationOptions = {sizePerPageList:[
      {text: '10', value: 10},
      {text: '50', value: 50},
      {text: '100', value: 100},
      {text: '500', value: 500},
    ]}
  useEffect(() => {
    if (!tableColumns) {
      return;
    } else {
      const visibleColumnsDefault = {};
      for (let colObj of tableColumns) {
        visibleColumnsDefault[colObj.dataField] = !colObj.hidden;
      }
      setMyToggles(visibleColumnsDefault);
    }
  }, [tableColumns]);

  const tableElementsComplete =
    tableColumns && tableArr && tableColumns.length > 1 && tableArr.length > 0;
  // why does JS think the empty object have length 1???
  if (!tableElementsComplete) {
    // don't display if there are no tableColumns
    return null;
  } else {
    return (
      <ToolkitProvider
        keyField={keyField}
        data={tableArr}
        columns={tableColumns}
        columnToggle
        exportCSV
      >
        {(props) => (
          <div>
            <div className="expand-genders">
              <Button onClick={() => setModalShow(true)}>
                Other Genders Breakdown
              </Button>

              <ModalComponent
                show={modalShow}
                onHide={() => setModalShow(false)}
                {...props.columnToggleProps}
                newToggles={myToggles}
                setMyToggles={setMyToggles}
              />
            </div>

            {/* if myToggles is null don't pass in columnToggle props */}
            {myToggles ? (
              <BootstrapTable
                {...props.baseProps}
                keyField={keyField}
                columnToggle={{ toggles: myToggles }}
                filter={filterFactory({ afterFilter })}
                pagination={paginationFactory(paginationOptions)}
                striped
                hover
                condensed
                defaultSorted={defaultSorted}
              />
            ) : null}
          </div>
        )}
      </ToolkitProvider>
    );
  }
}

export default GenderTable;
