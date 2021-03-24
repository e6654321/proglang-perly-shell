import { listeners } from 'process';
import constantTypes from '../constants/constantTypes';
import { ActualValue, ExecuteOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';
import { VAR_NOT_INIT, INPUT_INVALID } from '../constants/errors';
import { count } from 'console';
import { stream } from '../constants/reservedWords';

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
    let value = 0;
   
    statement.forEach((token) => {
  
      
        if(token.type === constantTypes.VAR){
            
            variables.forEach((inputVar) => {
              if(inputVar.identifier === token.value){
                if(inputVar.dataType === "INT"){
                  if(newInput[i].match(/^\d+$/)){
                    inputVar.value = newInput[i];
                    i++;
                    flag = 1;
                  }
                  else{
                    output.output = INPUT_INVALID;
                    output.status = true;
                    console.log("Integer error");
                    i++;
                    flag = 1;
                  }
                }
                else if(inputVar.dataType === "FLOAT"){
                  if(newInput[i].match(/^[-+]?[0-9]+\.[0-9]+$/)){
                    inputVar.value = newInput[i];
                    i++;
                    flag = 1;
                  }
                  else{
                    output.output = INPUT_INVALID;
                    output.status = true;
                    console.log("Float error");
                    i++;
                    flag = 1;
                  }
                }
                else if(inputVar.dataType === "CHAR"){
                  if(newInput[i].match(/^[a-zA-Z0-9]*$/)){
                    inputVar.value = newInput[i];
                    i++;
                    flag = 1;
                  }
                  else{
                    output.output = INPUT_INVALID;
                    output.status = true;
                    console.log("Char error");
                    i++;
                    flag = 1;
                  }
                }
                else if(inputVar.dataType === "BOOL"){
                  if(newInput[i].match("TRUE") || newInput[i].match("FALSE")){
                    inputVar.value = newInput[i];
                    i++;
                    flag = 1;
                  }
                  else{
                    output.output = INPUT_INVALID;
                    output.status = true;
                    console.log("Bool error");
                    i++;
                    flag = 1;
                  }
                }
                
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