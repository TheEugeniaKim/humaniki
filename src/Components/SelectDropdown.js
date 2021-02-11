import React from 'react'
import { default as Select } from 'react-select'
import { selectAllOption } from '../utils'

function SelectDropdown(props){

  function handleOnChange(selected, event){
    console.log(event)
    if (selected !== null && selected.length > 0) {
      if (selected[selected.length - 1].value === selectAllOption.value) {
        return props.onChange([selectAllOption, ...props.options])
      }
      let result = []
      if (selected.length === props.options.length) {
        if (selected.includes(selectAllOption)) {
          result = selected.filter(
            option => option.value !== selectAllOption.value
          )
        } else if (event.action === "select-option") {
          result = [selectAllOption, ...props.options]
        }
        return props.onChange(result)
      }
    }
    return props.onChange(selected)
  }

  if (props.allowSelectAll){
    return (
      <Select
        {...props}
        options={[selectAllOption, ...props.options]}
        onChange={handleOnChange}
      />
    )
  }

  return <Select {...props} />
}

export default SelectDropdown 