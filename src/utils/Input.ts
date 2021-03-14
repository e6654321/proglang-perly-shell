import { listeners } from 'process';
import constantTypes from '../constants/constantTypes';
import { ActualValue, ExecuteOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';
import { MISS_START_ERROR, VAR_NOT_INIT } from '../constants/errors';
import { count } from 'console';

export default function inputValue(
  statement: ActualValue[],
  firstWord: String,
  getInput: () => Promise<string>,
  variables: Variable[],
): ExecuteOutput {
  let output : ExecuteOutput = {
      output: '',
      status: false,
  };
  const hasInput = !!Number(localStorage.getItem('hasInput'));

  if (hasInput) {
    getInput();

    return {
      ...output,
      output: 'INPUT',
      status: true,
    };
  }

  getInput().then((input) => {  
    localStorage.setItem('hasInput', '1');
    localStorage.setItem('inputLine', '0');
    localStorage.setItem('blockFlag', '0');
    let flag = 0;
    let newInput = input.split(' ');
    let i=0;
    statement.forEach((token) => {
  
      
        if(token.type === constantTypes.VAR){
            
            variables.forEach((inputVar) => {
              if(inputVar.identifier === token.value){
                inputVar.value = newInput[i];
                i++;
                flag = 1;
              }
            });
            if(flag===0){
              output.output = VAR_NOT_INIT.replace(/:token/, token.value);
              output.status = true;
              console.log("Variable "+token.value+" not initialized");
            }
        }
        flag = 0;
    });
    

  });
      
  //console.log(count);
  return output;
}