import React from 'react'
import { ACTIONS } from './App'

const OperationButton = ({ operand, dispatch }) => {
  return (
    <button className="bg-blue" onClick={()=> dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: {operand} })}>{operand}</button>
  )
}

export default OperationButton