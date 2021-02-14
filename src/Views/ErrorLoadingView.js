import React, { useState, useEffect } from 'react';
import ErrorDiv from '../Components/ErrorDiv';
import LoadingDiv from '../Components/LoadingDiv';
// import { errorDiv, loadingDiv} from '../utils'

function ErrorLoadingView({API}){
  const [isLoading, setIsLoading] = useState(true);
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
    console.log("processCB", errors, data)
    
    if (errors){
      console.log("in IF")
      setIsErrored(errors)
    }
    console.log("isErrored", isErrored)
  }

  console.log("BEFORE RETURN", isErrored)
  return (
    <div>
      {isErrored ? <ErrorDiv errors={isErrored} /> : null }
    </div>
  )
}

export default ErrorLoadingView