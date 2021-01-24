import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, { afterFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { toast } from 'react-toastify'

function GenderTable({ tableColumns, tableArr }) {
  const [showExpandGenders, setShowExpandGenders] = useState(false);
  const [modalShow, setModalShow] = useState(false)
  const [myToggles, setMyToggles] = useState({"male": true})

  useEffect(() => {
    const visibleColumnsDefault = {}
    for (let colObj of tableColumns){
      visibleColumnsDefault[colObj.dataField] = !colObj.hidden
    }
    setMyToggles(visibleColumnsDefault)
  }, [tableColumns])   

  function handleMyColumnToggle(dataField){
    let tempMyToggles = myToggles
    const targetVisibility = !tempMyToggles[dataField]
    tempMyToggles[dataField] = targetVisibility
    setMyToggles(tempMyToggles)
    toast(`Setting ${dataField} Column ${targetVisibility ? "Visible" : "Hidden"}`)
  }

  function MyVerticallyCenteredModal({
    columns,
    onColumnToggle,
    toggles, 
    show,
    onHide,
    newToggles
  }) {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Columns: 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {columns
            .map((column) => ({
              ...column,
              toggle: newToggles[column.dataField],
            }))
            .map((column) => (
              <button
                type="button"
                key={column.dataField}
                className={`btn btn-warning ${newToggles[column.dataField] ? "active" : ""}`}
                data-toggle="button"
                aria-pressed={newToggles[column.dataField] ? "true" : "false"}
                onClick={() => handleMyColumnToggle(column.dataField)}
              >
                {column.text}
              </button>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function handleGenderExpandClick(event) {
    setShowExpandGenders(!showExpandGenders);
  }

  if (tableColumns.length>0 ){
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
            <div className="expand-genders">
              <Button onClick={() => setModalShow(true)} >
                Other Genders Breakdown
              </Button> 

              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                {...props.columnToggleProps}
                newToggles={myToggles}
              /> 
            </div>

            {/* if myToggles is null don't pass in columnToggle props */}
            { myToggles ? 
              <BootstrapTable
                {...props.baseProps}
                columnToggle={{"toggles": myToggles}}
                filter={filterFactory({ afterFilter })}
                pagination={paginationFactory()}
                striped
                condensed
              /> : 
              null
            }
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
