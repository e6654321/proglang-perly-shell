/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ConsoleContext } from './contexts/ConsoleContext';
import { VariablesContext } from './contexts/VariablesContext';
import HomePage from './pages/HomePage';
import defaultTheme from './themes/defaultTheme';
import { Variable } from './types/Variable.type';

function App() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [consoleOutput, setConsoleOutput] = useState({output: ''});
  const [consoleInput, setConsoleInput] = useState<string>('');
  const [isInput, setIsInput] = useState<boolean>(false);

  async function getInput() {
    const hasInput = !!Number(localStorage.getItem('hasInput'));

    if (!hasInput) {
      return consoleInput;
    } else {
      setIsInput(true);
      setConsoleInput('');
      return '';
    }
  }

  async function setInput(value: string) {
    await setConsoleInput(value);
  }

  async function setOutput(value: string) {
    await setConsoleOutput({output: value});
  }

  function clearInput() {
    setConsoleInput('');
  }

  async function clearOutput() {
    consoleOutput.output = '';
  }

  function handleSetIsInput(value: boolean) {
    setIsInput(value);
  }

  function clearVariables () {
    variables.splice(0, variables.length);
  }

  function appendVariables (value: Variable[]) {
    value.forEach((value) => variables.push(value));
  }

  return (
    <Router>
      <Switch>
        <ThemeProvider theme={defaultTheme}>
          <VariablesContext.Provider value={{variables, appendVariables, clearVariables}}>
            <ConsoleContext.Provider value={
              {
                consoleInput,
                consoleOutput,
                isInput,
                getInput,
                setIsInput: handleSetIsInput,
                setInput,
                setOutput,
                clearInput,
                clearOutput,
              }}>
              <Route component={HomePage} />
            </ConsoleContext.Provider>
          </VariablesContext.Provider>
        </ThemeProvider>
      </Switch>
    </Router>
  );
}

export default App;
