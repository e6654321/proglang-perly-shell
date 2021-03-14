import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from "styled-components";

import Console from './components/Console';
import Editor from './components/Editor';
import Header from './components/Header';
import { ConsoleContext } from '../contexts/ConsoleContext';
import { VariablesContext } from '../contexts/VariablesContext';
import * as Interpreter from '../utils/Interpreter';

export default function HomePage () {
  const [code, setCode] = useState<string>('');
  const [isError, setIsError] = useState<Boolean>(false);
  const [isRunning, setIsRunning] = useState<Boolean>(false);
  const { consoleOutput, isInput, getInput, setOutput } = useContext(ConsoleContext);
  const { variables, appendVariables, clearVariables } = useContext(VariablesContext);
  
  useEffect(() => {
    const hasInput = !!Number(localStorage.getItem('hasInput'));
    const inputLine = !!Number(localStorage.getItem('inputLine'));

    if (!isInput && !hasInput && inputLine) {
      onRun();
      setIsRunning(false);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInput])

  useEffect(() => {
    localStorage.setItem('hasInput', '1');
    localStorage.setItem('inputLine', '0');
    localStorage.setItem('blockFlag', '0');
    consoleOutput.output = '';
    setIsRunning(false);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  function onChange(newValue: string) {
    setCode(newValue);
  }

  async function onRun() {
    setIsError(false);
    const hasInput = !!Number(localStorage.getItem('hasInput'));
    const inputLine = Number(localStorage.getItem('inputLine'));
    let codeToExecute = code.split('\n').slice(inputLine-1);

    if (hasInput) {
      setIsRunning(true);
      await clearVariables();

      consoleOutput.output = '';
    }

    const terminal = await Interpreter.executeProgram(
      hasInput ? code.split('\n') : codeToExecute,
      variables,
      appendVariables,
      setOutput,
      isInput,
      getInput,
      consoleOutput.output,
    );

    if (terminal.output !== 'INPUT') {
      setIsError(terminal.status);
      if (terminal.status) {
        await clearVariables();
        await setOutput(terminal.output); //if error
        setIsRunning(false);
      }
    }
    
    if (!hasInput) {
      setIsRunning(false);
    }
  }

  const displayVariables = variables.map((variable, index) => {
    return (
      <VariableWrapper key={index}>
        <h5>{variable.identifier}</h5>
        <h6>Datatype: {variable.dataType}</h6>
        <h6>Value: {String(variable.value)}</h6>
      </VariableWrapper>
    );
  });

  return (
    <StyledContainer fluid>
      <StyledRow className="mr-0 ml-0">
        <Header isRunning={isRunning} onRun={() => {
          localStorage.setItem('hasInput', '1');
          localStorage.setItem('inputLine', '0');
          localStorage.setItem('blockFlag', '0');
          onRun();
        }} />
        <StyledCol md={6} sm={12} >
          <Editor value={code} onChange={onChange} />
        </StyledCol>
        <StyledCol md={6} sm={12} >
          <Console
            status={isError}
          />
        </StyledCol>
        <VariableContainer>
          {displayVariables}
        </VariableContainer>
      </StyledRow>
    </StyledContainer>
  );
}

const StyledContainer = styled(Container)`
  position:absolute;
  bottom: 0px;
  top: 0px;
  right: 0px;
  left: 0px;
  padding: 0px;
  margin: 0px auto;
`;

const StyledCol = styled(Col)`
  padding: 0;
`;

const StyledRow = styled(Row)`
  padding: 0;
`;

const VariableContainer = styled(Container)`
  display: flex;
  flex-direction: row;
`;

const VariableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
`;
