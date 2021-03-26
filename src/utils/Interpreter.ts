import constantTypes from '../constants/constantTypes';
import { SYNTAX_ERROR, MISS_STOP_ERROR,UNEXP_LINE_ERROR } from '../constants/errors';
import { ActualValue, ExecuteOutput, ParseOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';
import * as LexicalAnalyzer from './LexicalAnalyzer';
import Declare from './VariableDeclaration';
import checkCompleteBlock from './Block';
import { executeWhile } from './Control';
import { Evaluate } from './EvaluateExpressions';
import inputValue from './Input';
import Output from './Output';

export function executeProgram (
  lines: Array<string>,
  consoleOutput: {output: string},
  lineStart: number,
) : ExecuteOutput {
  let output : ExecuteOutput = {
    output: '',
    status: false,
  };
  let lineNumber = lineStart;


  lines.forEach((line) => {
    const cleanedLine = line.trim();
    let parsedStatement: ParseOutput;

    if (cleanedLine.length === 0 || output.status){
      return;
    } else {
      parsedStatement = LexicalAnalyzer.parseStatement(line);
    }

    if (parsedStatement.error !== '') {
      output.output = parsedStatement.error.replace(/:lineNumber/, lineNumber.toString());
      output.status = true;
      return;
    } else {
      output = runStatement(
        parsedStatement.actualValue,
        consoleOutput,
      );
      if (output.status) {
        if (output.output === 'INPUT') {
          localStorage.setItem('inputLine', lineNumber.toString());
        } else if (output.output === 'WHILE') {
          localStorage.setItem('whileLine', lineNumber.toString());
        } else {
          output.output = output.output.replace(/:lineNumber/, (lineNumber+1).toString());
        }
        return;
      }
      
    }
   
    let flag = Number(localStorage.getItem('blockFlag'));
    if(flag === 2){
      if(parsedStatement.actualValue[0].value === "STOP"){
        return;
      }

      else if(parsedStatement.actualValue.length>0){
        output.output = UNEXP_LINE_ERROR;
        output.status = true;
      }
        
    }
    
    lineNumber += 1;
  });
  if (!output.status) {
    let flag = Number(localStorage.getItem('blockFlag'));
  
    if(flag !== 2){
      output.output = MISS_STOP_ERROR;
      output.status = true;
    }
  
    localStorage.setItem('blockFlag', '0'); //reset the blockFlag after reading all the lines
  }

  return output;
}


export function runStatement(
  statement: ActualValue[],
  consoleOutput: {output: string},
) : ExecuteOutput {
  let output : ExecuteOutput = {
    output: '',
    status: false,
  };
  

  if (statement.length > 0) {
    const statementType = statement[0].type;
    const newStatement = statement.slice(1);
    const firstWord = statement[0].value;
  
    switch (statementType) {
      case (constantTypes.DECLARATION) :
        output = Declare(newStatement);
        break;
      case(constantTypes.BLOCK) :
        output = checkCompleteBlock(firstWord);
        break;
      case (constantTypes.IO) :
        if(statement[0].value === "OUTPUT:"){
          output = Output(newStatement, consoleOutput);
        } else {
          output = inputValue(newStatement);
        }
        break;
      case (constantTypes.VAR) :
        output = Evaluate(statement);
        break;
      case (constantTypes.CONTROL) :
        if(statement[0].value === "WHILE"){
          // output = executeWhile(newStatement);
        }
        break;
      default:
        output.output = SYNTAX_ERROR.replace(/:token/, statement[0].value);
        output.status = true;
    }
  }

  return output;
}