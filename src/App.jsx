import { useEffect, useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const initialState = {
  previousOperand: "",
  currentOperand: "",
  operation: "",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == "" && state.previousOperand == "")
        return state;
      if (state.currentOperand == "") {
        return {
          ...state,
          operation: payload.operand,
        };
      }
      if (state.previousOperand == "") {
        return {
          ...state,
          operation: payload.operand,
          previousOperand: state.currentOperand,
          currentOperand: "",
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operand,
        currentOperand: "",
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == "" ||
        state.currentOperand == "" ||
        state.previousOperand == ""
      )
        return state;
      return {
        ...state,
        overwrite: true,
        previousOperand: "",
        operation: "",
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: "",
        };
      }
      if(state.currentOperand == "") return state
      if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand: ""
        }
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

      case ACTIONS.CLEAR:
        return initialState
  }
};

const evaluate = ({ previousOperand, currentOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  return computation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

const formatOperand = (operand)=> {
  if(operand == "") return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ previousOperand, currentOperand, operation }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // useEffect(() => {
  //   console.log("Current State:", {
  //     previousOperand,
  //     currentOperand,
  //     operation,
  //   });
  // }, [previousOperand, currentOperand, operation]);

  return (
    <div className="App">
      <h1>Calculator</h1>
      <div className="calculator-grid">
        <div className="calculator-output">
          <div className="previous-operand">
            {formatOperand(previousOperand)}
            <span>{operation}</span>
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>

        <button className="span-two bg-gray" onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button
          className="bg-gray"
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationButton operand="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operand="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operand="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operand="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two bg-blue"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
