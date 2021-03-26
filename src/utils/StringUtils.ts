/* eslint-disable no-regex-spaces */
export function checkKeyIfSpecialCharacter (value: string) {
  return (
    value === 'Unidentified' ||
    value === 'Shift' ||
    value === 'Control'  ||
    value === 'Alt'  ||
    value === 'ContextMenu'
  );
}

export function tokenize(value: string) {
  return value.replace(/,/g, " , ")
    .replace(/&/g, " & ")
    .replace(/\+/g, " + ")
    .replace(/- /g, " - ")
    .replace(/\*/g, " * ")
    .replace(/\//g, " / ")
    .replace(/%/g, " % ")
    .replace(/=/g, " = ")
    .replace(/%/g, " % ")
    .replace(/</g, " < ")
    .replace(/>/g, " > ")
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .replace(/=  =/g, "==")
    .replace(/<  =/g, "<=")
    .replace(/>  =/g, ">=")
    .replace(/<  >/g, " <> ")
    .split(/[\s]+/);
}