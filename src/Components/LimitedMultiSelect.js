import React, {Component} from "react";
import Select, {components} from "react-select";

export const ValueContainer = ({children, getValue, ...props}) => {
    var values = getValue();
    var valueLabel = "";
    const showLimit = 10
    if (values.length > 0) {
        const showingValues = values.slice(0, showLimit)
        const showingLabels = showingValues.map(v => props.selectProps.getOptionLabel(v))
        valueLabel += showingLabels.join(', ');
    }
    if (values.length > showLimit) valueLabel += ` & ${values.length - showLimit} more`;

    // Keep standard placeholder and input from react-select
    var childsToRender = React.Children.toArray(children).filter(
        child =>
            ["Input", "DummyInput", "Placeholder"].indexOf(child.type.name) >= 0
    );

    return (
        <components.ValueContainer {...props}>
            {!props.selectProps.inputValue && valueLabel}
            {childsToRender}
        </components.ValueContainer>
    );
};

