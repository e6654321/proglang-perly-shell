import Stack from 'ts-data.stack';

import constantTypes from '../constants/constantTypes';
import { DUP_VAR_ERROR, SYNTAX_ERROR } from '../constants/errors';
import { bool, declartion } from '../constants/reservedWords';
import { ActualValue, ExecuteOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';

export default function Declare(
  statement: ActualValue[],
  variables: Variable[],
  appendVariables: (value: Variable[]) => void,
): ExecuteOutput {
  const output: ExecuteOutput = {
    output: '',
    status: false,
  }
  let stack = new Stack<ActualValue>();

  // console.log(statement);
  statement.forEach((token) => {
    if (output.status) {
      return;
    }
    
    if (token.type === constantTypes.VAR &&
      (stack.isEmpty() || stack.peek().value === ',')) {
      
      if (!stack.isEmpty() && stack.peek().value === ',') {
        stack.pop();
      }

      stack.push(token);

    } else if (isVariableType(token.type) &&
      (!stack.isEmpty() && stack.peek().value === '=')) {

      stack.push(token);

    } else if (token.value === ',' || token.value === '=') {

      stack.push(token);
      
    } else if (token.value === declartion.AS &&
      (stack.peek().type === constantTypes.VAR || isVariableType(stack.peek().type))) {

      stack.push(token);

    } else if (token.type === constantTypes.DATATYPE &&
      stack.peek().value === declartion.AS) {

      stack.pop();
      stack.push(token);

      const { variables: newVars, stack: newStack } = getVariables(stack);

      stack = newStack;
      
      const duplicates = variables.find((value) =>{
        const variable = value;

        return newVars.find((value) => variable.identifier === value.identifier);
      });

      if (duplicates) {
        output.output = DUP_VAR_ERROR.replace(/:token/, duplicates.identifier);
        output.status = true;
      } else {
        appendVariables(newVars);
      }
      
    } else {
      output.output = SYNTAX_ERROR.replace(/:token/, token.value);
      output.status = true;
    }

    // if (!stack.isEmpty())
    // console.log(stack.peek());
    
  });
  
  if (!stack.isEmpty()) {
    output.output = SYNTAX_ERROR.replace(/:token/, stack.peek().value);
    output.status = true;
  }

  return output;
}

export function isVariableType (type: Number) {
  return type === constantTypes.CHAR || type === constantTypes.BOOL ||
    type === constantTypes.INT || type === constantTypes.FLOAT;
}

export function getVariables(stack: Stack<ActualValue>) {
  const variables: Variable[] = [];
  const variableType = stack.peek().value;
  let variable: Variable = {
    dataType: '',
    identifier: '',
    value: null,
  };

  stack.pop();

  while(!stack.isEmpty()) {
    const token = stack.peek();

    variable = {
      dataType: variableType,
      identifier: token.value,
      value: null,
    }

    if (isVariableType(token.type)) {
      variable.value = getVariableValue(token);

      stack.pop();
    }

    if (token.type === constantTypes.VAR){
      variables.push(variable);
    }

    stack.pop();    
  }

  return { variables, stack };
}

export function getVariableValue(token: ActualValue) {
  let value: string | Number | boolean = token.value;

  if (token.type === constantTypes.BOOL) {
    value = value === bool.TRUE;
  } else if (token.type !== constantTypes.CHAR) {
    value = Number(value);
  } else {
    value = value.slice(1,token.value.length-1);
  }

  return value;
}