import React from 'react'
// import PropTypes from "prop-types";
import { default as Select } from 'react-select'

function MultiSelectDropdown(props){

  const selectAllOption = {
    label: "Select All",
    value: "*"
  }

  function handleOnChange(selected, event){
    console.log("selected", selected, "event", event)
    if (selected !== null && selected.length > 0) {
      if (selected[selected.length - 1].value === selectAllOption.value) {
        return props.onChange([selectAllOption, ...props.options]);
      }
      let result = [];
      if (selected.length === props.options.length) {
        if (selected.includes(selectAllOption)) {
          result = selected.filter(
            option => option.value !== selectAllOption.value
          );
        } else if (event.action === "select-option") {
          result = [selectAllOption, ...props.options];
        }
        return props.onChange(result);
      }
    }
    return props.onChange(selected)
  }

  return (
    <Select
      {...props}
      options={[selectAllOption, ...props.options]}
      onChange={handleOnChange}
    />
  );
  
}

// MultiSelectDropdown.propTypes = {
//   options: PropTypes.array,
//   value: PropTypes.any,
//   onChange: PropTypes.func,
//   allowSelectAll: PropTypes.bool,
//   allOption: PropTypes.shape({
//     label: PropTypes.string,
//     value: PropTypes.string
//   })
// };

export default MultiSelectDropdown 