import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'

function ModalComponent({
  columns,
  onColumnToggle,
  toggles, 
  show,
  onHide,
  newToggles, 
  setMyToggles
}) {

  function handleMyColumnToggle(dataField){
    let tempMyToggles = newToggles
    const targetVisibility = !tempMyToggles[dataField]
    tempMyToggles[dataField] = targetVisibility
    setMyToggles(tempMyToggles)
    toast(`Setting ${dataField} Column ${targetVisibility ? "Visible" : "Hidden"}`)
  }

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

export default ModalComponent