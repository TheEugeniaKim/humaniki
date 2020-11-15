import React, { useReducer, useMemo } from 'react'

const AppContext = React.createContext()

function appReducer(state, action){
  switch(action.type){
    case "FETCH_DATA":
      return {...state}
    default: 
      throw new Error("Try Again ")
  }
}

const initialState = {
  view: "about",
  data: []

}