import constantTypes from '../constants/constantTypes';
import { SYNTAX_ERROR } from '../constants/errors';
import { ActualValue, ExecuteOutput, ParseOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';
import * as LexicalAnalyzer from './LexicalAnalyzer';
import { CheckSyntax } from './Output';
import Declare from './VariableDeclaration';

export function executeProgram (
  lines: Array<string>,
  variables: Variable[],
  appendVariables: (value: Variable[]) => void,
  setOutput: (value: string) => void,
) : ExecuteOutput {
  let output : ExecuteOutput = {
    output: '',
    status: false,
  };
  let lineNumber = 0;

  lines.forEach((line) => {
    const cleanedLine = line.trim();
    let parsedStatement: ParseOutput;
    lineNumber += 1;

    if (cleanedLine.length === 0 || output.status){
      return;
    } else {
      parsedStatement = LexicalAnalyzer.parseStatement(line);
    }

    //console.log(parsedStatement,output);

    if (parsedStatement.error !== '') {
      output.output = parsedStatement.error.replace(/:lineNumber/, lineNumber.toString());
      output.status = true;

      return;
    } else {
      output = runStatement(parsedStatement.actualValue, variables, appendVariables, setOutput);

      if (output.status) {
        output.output = output.output.replace(/:lineNumber/, lineNumber.toString());
      }

      return;
    }
  });

  return output;
}

export function runStatement(
  statement: ActualValue[],
  variables: Variable[],
  appendVariables: (value: Variable[]) => void,
  setOutput: (value: string) => void,
) : ExecuteOutput {
  let output : ExecuteOutput = {
    output: '',
    status: false,
  };

  if (statement.length > 0) {
    const statementType = statement[0].type;
    const newStatement = statement.slice(1);
  
    switch (statementType) {
      case (constantTypes.DECLARATION) :
        output = Declare(newStatement, variables, appendVariables);
        break;
      case (constantTypes.BLOCK) :
        break;
      case (constantTypes.IO) :
        output = CheckSyntax(statement, variables);
        break;
      case (constantTypes.VAR) :
        break;
      default:
        output.output = SYNTAX_ERROR.replace(/:token/, statement[0].value);
        output.status = true;
    }
  }

  return output;
}