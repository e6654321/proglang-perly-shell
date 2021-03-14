import { createContext } from 'react';

type Context = {
  consoleInput: string;
  consoleOutput: {output: string};
  isInput: Boolean;
  getInput: () => Promise<string>;
  setIsInput: (value: boolean) => void;
  setInput: (value: string) => Promise<void>;
  setOutput: (value: string) => Promise<void>;
  clearInput: () => void;
  clearOutput: () => Promise<void>;
}

const defaultContext: Context = {
  consoleInput: '',
  consoleOutput: {output: ''},
  isInput: false,
  getInput: async () => {return ''},
  setIsInput: () => {},
  setInput: async () => {},
  setOutput: async () => {},
  clearInput: () => {},
  clearOutput: async () => {},
}

export const ConsoleContext = createContext<Context>(defaultContext);