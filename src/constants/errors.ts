export const CONST_ERROR = `Constant error on line :lineNumber: Invalid constant ':token'.`;

export const SYNTAX_ERROR = `Syntax error on line :lineNumber: Invalid syntax at ':token'.`;

export const EXPRESSION_DUP_EQ_ERROR = `Expression error on line :lineNumber: Lacking '='.`;

export const EXPRESSION_ERROR = `Expression error on line :lineNumber: Invalid expression.`;

export const DUP_VAR_ERROR = `Variable error on line :lineNumber: Duplicate variable ':token'.`;

export const NO_VAR_ERROR = `Variable error on line :lineNumber: No variable ':token'.`;

export const NULL_VAR_ERROR = `Variable error on line :lineNumber: Null variable ':token'.`;

export const STOP_ERROR = 'STOP is already implemented';

export const APPND_NULL_ERROR = `Appending error on line :lineNumber: Cannot Append to Null: ':token'.`

export const START_ERROR = 'START is already implemented';

export const MISS_START_ERROR = 'Missing START statement.';

export const MISS_STOP_ERROR = 'Missing STOP statement.';

export const UNEXP_LINE_ERROR = 'Unexpected line statement after STOP.';

export const VAR_NOT_INIT = `Variable ':token' not initialized.`;

export const INPUT_INVALID = `The input provided does not match to its data type.`;
