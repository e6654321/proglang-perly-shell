import constantTypes from '../constants/constantTypes';
import { NO_VAR_ERROR, NULL_VAR_ERROR, EXPRESSION_DUP_EQ_ERROR, EXPRESSION_ERROR } from '../constants/errors';
import { dataType } from '../constants/reservedWords';
import { ActualValue, ExecuteOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';

import { isVariableType } from './VariableDeclaration';

export function Evaluate(
  statement: ActualValue[],
): ExecuteOutput {
  let variables: Variable[] = JSON.parse(localStorage.getItem('variables') || '[]');
  const output: ExecuteOutput = {
    output: '',
    status: false,
  }
  let expression = '';
  let leftHandSide: ActualValue[] = [];
  let rightHandSide: string = '';
  let isEqualFlag: boolean = true;
  let isLeftDone: boolean = false;
  // console.log(statement);

  statement.forEach((token, index) => {
    const type = token.type;

    if (output.status) {
      return;
    }

    if (type === constantTypes.VAR && (index === 0 || statement[index-1].value === '=')
      && (index < statement.length-1 && statement[index+1].value === '=')) {
      if (variables.find((variable: Variable) => variable.identifier === token.value)) {
        isLeftDone = false;
        leftHandSide.push(token);
      } else {
        output.output = NO_VAR_ERROR.replace(/:token/, token.value);
        output.status = true;
      }
    } else if (type === constantTypes.VAR) {
      const thisVar = variables.find((variable: Variable) => variable.identifier === token.value);
      if (thisVar?.value) {
        expression += ' ' + thisVar?.value;
      } else {
        output.output = NULL_VAR_ERROR.replace(/:token/, token.value);
        output.status = true;
      }
    } else if (token.value === '=') {
      if (!isLeftDone) {
        isLeftDone = true;
      } else {
        output.output = EXPRESSION_DUP_EQ_ERROR;
        output.status = true;
      }
    } else if (token.type === constantTypes.OPERATOR) {
      if (!isLeftDone) {
        output.output = EXPRESSION_ERROR;
        output.status = true;
      } else {
        switch(token.value){
          case '<>':
            expression += '!=';
            break;
          case 'AND':
            expression += '&&';
            break;
          case 'OR':
            expression += '||';
            break;
          case 'NOT':
            expression += ' !';
            break;
          default:
            expression += token.value;
        }
      }
    } else {
      if (isLeftDone) {
        expression +=  ' ' + token.value;
      } else {
        output.output = EXPRESSION_ERROR;
        output.status = true;
      }
    }
  });

  leftHandSide.forEach((token) => {
    if (isEqualFlag) {
      isEqualFlag = token.type === leftHandSide[0].type;
    }
  });
  
  if (isEqualFlag) {
    try {
      rightHandSide = getValue(expression);
      leftHandSide.forEach((token: ActualValue) =>{
        variables.forEach((value: Variable) => {
          if (value.identifier === token.value) {
            setValue(value, rightHandSide);
          }
        });
        
      });
    } catch (error) {
      output.output = error.message.toString()+' on line :lineNumber';
      output.status = true;
    }
  }
  
  localStorage.setItem('variables',JSON.stringify(variables));
  return output;
}

export function getValue(expression: string): string {
  // eslint-disable-next-line no-eval
  const newExp = expression.replace(/<>/,'!=');

  return eval(newExp);
}

export function setValue(variable: Variable, value: string) {
  if (variable.dataType === dataType.BOOL) {
    variable.value = !!value;
  } else if (variable.dataType === dataType.CHAR) {
    variable.value = value;
  } else {
    variable.value = Number(value);
  }
}