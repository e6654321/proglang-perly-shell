
import constantTypes from '../constants/constantTypes';
import { APPND_NULL_ERROR } from '../constants/errors';
import { dataType } from '../constants/reservedWords';
import { ActualValue, ExecuteOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';
import { getValue } from './EvaluateExpressions';

export default function Output(
    statement: ActualValue[],
    consoleOutput: {output: string},
    ): ExecuteOutput {
    let variables: Variable[] = JSON.parse(localStorage.getItem('variables') || '[]');
    const output: ExecuteOutput = {
      output: '',
      status: false,
    }
    let concatFlag = false;
    let flagOnBrackets = false;
    let flagNegative = false;
    let temp,cleanedChar,actualOutput;
    let varString = ''
    statement.forEach((token) => {console.log(token)
      if (output.status) {
        return;
      }

      if(token.value === '-' && token.type === constantTypes.OPERATOR){
        flagNegative = true;
      }
      else if(token.value === '&' && token.type === constantTypes.SPECIAL){
         if(output.output !== ''){
           concatFlag = true;
         }
         else if(output.output === ''){
          output.output = APPND_NULL_ERROR.replace(/:token/, token.value ?? '');
          output.status = true;
          concatFlag = false;
         }
      }
      else if(token.type === constantTypes.VAR){
        // console.log(variables);
        // variables = thisVariables.map((value)=> value);
        let thisVar: Variable = {
          dataType: '',
          identifier: '',
          value: '',
        };
        variables.forEach((variable: Variable)=> {
          // console.log(variable);
            if(variable.identifier === token.value){
              thisVar = variable;
            }
        })
        if(flagNegative && (thisVar?.dataType === dataType.INT || thisVar?.dataType === dataType.FLOAT)){
          thisVar.value = Number(thisVar.value) * -1;
        }
        if(concatFlag){
          temp = output.output.concat(thisVar?.value?.toString() ?? '');
          actualOutput = temp;
        } else{
          actualOutput = thisVar?.value?.toString() ?? '';
        }
        output.output = actualOutput;
        if(flagNegative && (thisVar?.dataType === dataType.INT || thisVar?.dataType === dataType.FLOAT)){
          thisVar.value = Number(thisVar.value) * -1;
        }
      }
      else if(token.type === constantTypes.CHAR || token.type === constantTypes.FLOAT || token.type === constantTypes.INT){
        
        if(token.type === constantTypes.CHAR){
          const tempS = token.value.toString();
          cleanedChar = tempS.substring(1,tempS.length-1);
          
          varString = '';

          for(let i = 0; i < cleanedChar.length; i++){
            if(!flagOnBrackets && cleanedChar[i] === '['){
              flagOnBrackets = true;
              continue;
            }
            if(flagOnBrackets){
              if(cleanedChar[i] !== ']'){
                varString += cleanedChar[i];
              }
              else{
                flagOnBrackets = false;
                continue;
              }
            }
            else{
              if(cleanedChar[i] === '#'){
                varString += ':newline';
              }
              else{
                varString += cleanedChar[i];
              }
            }
          }

        const withNewLine = varString.replace(':newline','\n');
        temp = output.output.concat(withNewLine);
        }else
          temp = output.output.concat(token.value.toString());
        output.output = temp;
      }
    });

    if (!output.status) {
      consoleOutput.output += output.output;
    }
   return output;
}
