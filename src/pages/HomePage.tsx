import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from "styled-components";

import Console from './components/Console';
import Editor from './components/Editor';
import Header from './components/Header';
import { ConsoleContext } from '../contexts/ConsoleContext';
import { VariablesContext } from '../contexts/VariablesContext';
import { Variable } from '../types/Variable.type';
import * as Interpreter from '../utils/Interpreter';
import { couldStartTrivia } from 'typescript';

export default function HomePage () {
  const [code, setCode] = useState<string>('');
  const [isError, setIsError] = useState<Boolean>(false);
  const [isLoop, setIsLoop] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<Boolean>(false);
  const { consoleOutput, isInput, setInput, setIsInput, setOutput } = useContext(ConsoleContext);
  let variables: Variable[] = [];
  
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
    localStorage.setItem('whileFlag', '0');
    localStorage.setItem('loopCount', '0');
    localStorage.setItem('whileLine', '0');
    localStorage.setItem('hasInput', '1');
    localStorage.setItem('inputLine', '0');
    localStorage.setItem('blockFlag', '0');
    consoleOutput.output = '';
    setIsRunning(false);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  useEffect(() => {
    if (isLoop) {
      onRun();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoop])

  function onChange(newValue: string) {
    setCode(newValue);
  }

  async function onRun() {
    setIsError(false);
    const hasInput = !!Number(localStorage.getItem('hasInput'));
    const hasLoop = !!Number(localStorage.getItem('whileFlag'));
    let inputLine = Number(localStorage.getItem('inputLine'));
    let codeToExecute = code.split('\n').slice(inputLine);

    if (hasInput) {
      setIsRunning(true);
      localStorage.setItem('variables',JSON.stringify([]));
      localStorage.setItem('input','');

      consoleOutput.output = '';
    }

    if (hasLoop) {
      inputLine = Number(localStorage.getItem('whileLine'));
      codeToExecute = code.split('\n').slice(inputLine);
    }

    const terminal = Interpreter.executeProgram(
      hasInput ? code.split('\n') : codeToExecute,
      consoleOutput,
      inputLine,
    );
    
    if (terminal.output === 'INPUT') {
      setIsInput(true);
      setInput('');
    } else if (terminal.output === 'WHILE') {
      const inputLine = Number(localStorage.getItem('loopCount'));
      setIsLoop(inputLine);
    } else {
      setIsLoop(0);
      setIsError(terminal.status);
      if (terminal.status) {
        localStorage.setItem('variables',JSON.stringify([]));
        await setOutput(terminal.output); //if error
        setIsRunning(false);
      }
      else{
        setOutput(consoleOutput.output);
      }
      variables = JSON.parse(localStorage.getItem('variables') || '');
    }
    
    const newInputLine = Number(localStorage.getItem('inputLine'));

    if (!isLoop && hasInput && newInputLine === 0) {
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
          localStorage.setItem('whileFlag', '0');
          localStorage.setItem('loopCount', '0');
          localStorage.setItem('whileLine', '0');
          localStorage.setItem('hasInput', '1');
          localStorage.setItem('inputLine', '0');
          localStorage.setItem('blockFlag', '0');
          consoleOutput.output = '';
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
