import React, { useState, useEffect } from 'react';
import ErrorDiv from '../Components/ErrorDiv';

function ErrorLoadingView({API}){
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    API.get(
      {
        bias: "gender",
        metric: "gap",
        snapshot: "latest",
        population: "all_wikidata",
        property_obj: {"error_test": true}
      },
      processCB
    )
  }, [])

  function processCB(errors, data){
    if (errors){
      setIsErrored(errors)
    }
  }

  return (
    <div>
      {isErrored ? <ErrorDiv errors={isErrored} /> : null }
    </div>
  )
}

export default ErrorLoadingView