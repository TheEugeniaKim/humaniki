import React from "react";
import { Alert } from "react-bootstrap/";

function ErrorDiv({ errors }) {
  console.log("Errors are:", errors);
  const alerts = Object.keys(errors).map((errorKey, i) => (
    <Alert key={i} variant={"danger"}>
      {errorKey} : {JSON.stringify(errors[errorKey])}
    </Alert>
  ));

  return <div>{alerts}</div>;
}

export default ErrorDiv;
