/* eslint-disable no-useless-escape */
export const intRegEx = new RegExp(/^[-+]?\d+$/);

export const charRegEx = new RegExp(/^('(.*?)'|"(.*?)")$/);

export const floatRegEx = new RegExp(/[+-]?([0-9]*[.])?[0-9]+/);

export const varRegEx = new RegExp(/^[_a-z]\w*$/);

export const operatorRegEx = new RegExp(/^(\+|\-|\*|\/|\=|>|<|>\=|<=|%|\=\=|<>|\(|\)|AND|OR|NOT)$/);

export const specialRegEx = new RegExp(/^(&|,|'|")$/);

export const inputRegEx = new RegExp(/^\w*$/);