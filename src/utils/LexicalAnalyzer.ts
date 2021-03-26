import constantTypes from '../constants/constantTypes';
import { CONST_ERROR } from '../constants/errors';
import { intRegEx, charRegEx, floatRegEx, varRegEx, operatorRegEx, specialRegEx } from '../constants/RegEx';
import { block, bool, control, dataType, declartion, stream } from '../constants/reservedWords';
import { ParseOutput } from '../types/Output.type';
import { tokenize } from './StringUtils';

export function parseStatement (statement: string) : ParseOutput {
  const { ERROR } = constantTypes;
  const output : ParseOutput = {
    actualValue: [],
    error: '',
  };
  const tokens: string[] = tokenize(statement);
  //console.log(tokens);

  if (tokens[1] === '*') {
    return output;
  }
  
  for (let i = 0; i < tokens.length; i += 1) {
    let type;

    if (tokens[i] === '') {
      continue;
    } else {
      type = getType(tokens[i]);
    }

    if (type === ERROR) {
      output.error = CONST_ERROR.replace(/:token/, tokens[i]);
      break;
    }

    output.actualValue.push({
      value: tokens[i],
      type,
    });
  }

  return output;
}

export function getType(token: string) {
  const { 
    BLOCK,
    BOOL,
    CONTROL,
    DECLARATION,
    DATATYPE,
    IO,
    VAR,
    ERROR,
    OPERATOR,
    SPECIAL,
    INT,
    CHAR,
    FLOAT,
  } = constantTypes;
  let type = ERROR;
  
  if (block.START === token || block.STOP === token) {
    type = BLOCK;
  } else if (bool.FALSE === token || bool.TRUE === token) {
    type = BOOL;
  } else if (control.ELSE === token || control.IF === token || control.WHILE === token) {
    type = CONTROL;
  } else if (declartion.AS === token || declartion.VAR === token) {
    type = DECLARATION;
  } else if (dataType.BOOL === token || dataType.CHAR === token || dataType.FLOAT === token || dataType.INT === token) {
    type = DATATYPE;
  } else if (stream.INPUT === token || stream.OUTPUT === token) {
    type = IO;
  } else if (operatorRegEx.test(token)) {
    type = OPERATOR;
  } else if (specialRegEx.test(token)) {
    type = SPECIAL;
  } else if (intRegEx.test(token)) {
    type = INT;
  } else if (charRegEx.test(token)) {
    type = CHAR;
  } else if (floatRegEx.test(token)) {
    type = FLOAT;
  } else if (varRegEx.test(token)) {
    type = VAR;
  } //console.log(token,type);

  return type;
}