import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from '../Components/Modal';
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, { afterFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

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

              <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                {...props.columnToggleProps}
                newToggles={myToggles}
                setMyToggles={setMyToggles}
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
