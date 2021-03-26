
import constantTypes from '../constants/constantTypes';
import { LOOP_EXCEED_ERROR, NO_VAR_ERROR } from '../constants/errors';
import { dataType } from '../constants/reservedWords';
import { ActualValue, ExecuteOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';
import { getValue } from './EvaluateExpressions';

export function executeWhile(statement: ActualValue[]) {
    let output : ExecuteOutput = {
      output: '',
      status: false,
    };
    const isLoop = !!localStorage.getItem('whileFlag');
    const variables: Variable[] = JSON.parse(localStorage.getItem('variables') || '[]');
    let loopCount = Number(localStorage.getItem('loopCount'));

    const exp = statement.map((s)=>{
      let val = s.value;

      if (s.type === constantTypes.VAR){
        const thisVar = variables.find((value)=>value.identifier===val);
        if(thisVar) {
          val = thisVar.value?.toString() || '';
        } else {
          output = {
            output: NO_VAR_ERROR.replace(/:token/, val),
            status: true,
          }
        }
      }

      return val;
    }).join(' ');

    if(output.output){
      return output;
    }

    try {
      const statementValue = Boolean(getValue(exp));
  
      if (statementValue){
        if (!isLoop && loopCount === 0) {
          localStorage.setItem('whileFlag', '1');
          output.output = 'WHILE';
          output.status = true;
        } else {
          if (loopCount > 200) {
            localStorage.setItem('whileFlag', '0');
            localStorage.setItem('loopCount', '0');
            output.output = LOOP_EXCEED_ERROR;
            output.status = true;
          }
    
          localStorage.setItem('loopCount', (loopCount+1).toString());
        }
        
        if (!output.status){
          output.output = 'WHILE';
          output.status = false;
        }
      }
    } catch(error){
      output.output = error.message.toString()+' on line :lineNumber';
      output.status = true;
    }

    return output;
}

export function executeIf(statement: ActualValue[]) {
  let output : ExecuteOutput = {
    output: '',
    status: false,
  };
  const skip = !!(localStorage.getItem('skip'));
  const variables: Variable[] = JSON.parse(localStorage.getItem('variables') || '[]');

  const exp = statement.map((s)=>{
    let val = s.value;

    if (s.type === constantTypes.VAR){
      const thisVar = variables.find((value)=>value.identifier===val);
      if(thisVar) {
        val = thisVar.value?.toString() || '';
      } else {
        output = {
          output: NO_VAR_ERROR.replace(/:token/, val),
          status: true,
        }
      }
    }

    return val;
  }).join(' ');

  if(output.output){
    return output;
  }

  try {
    const statementValue = Boolean(getValue(exp));   
    localStorage.setItem('blockFlag', '4');
    if (statementValue){
      localStorage.setItem('skip', '1');
    } else {
      localStorage.setItem('skip', '0');
    }
  } catch(error){
    output.output = error.message.toString()+' on line :lineNumber';
    output.status = true;
  }

  return output;
}