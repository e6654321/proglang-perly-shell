import { listeners } from 'process';
import constantTypes from '../constants/constantTypes';
import { ActualValue, ExecuteOutput } from '../types/Output.type';
import { Variable } from '../types/Variable.type';
import { MISS_START_ERROR,START_ERROR, STOP_ERROR } from '../constants/errors';
import { stat } from 'fs';


export default function checkCompleteBlock(statement: string): ExecuteOutput {

    
    let flag = Number(localStorage.getItem('blockFlag'));
    let output : ExecuteOutput = {
      output: '',
      status: false,
    };


    if(statement === "START" && flag === 1){ 
        flag = 3; //sets the flag to 3 to indicate that start is already implemented
    }

    else if(statement === "START" && flag===0){
        flag = 1; //sets the flag to 1 that start is first seen in the code
    }

    if(statement === "STOP" && flag === 0){
        output.output = MISS_START_ERROR; //Displays error that the START keyword is missing, after seeing STOP
        output.status = true;
    }

    if(statement === "STOP" && flag === 3){
        // console.log("START Flag");
       output.output = START_ERROR; //Displays error that START is implemented twice, after seeing stop
       output.status = true;
    }

    if(statement === "STOP" && flag === 2){
        output.output = STOP_ERROR; //Displays error that the START keyword is missing, after seeing STOP
        output.status = true;
    }

    if(statement === "STOP" && flag === 1){
        flag=2;  //full block with start and stop
    }

    localStorage.setItem('blockFlag', flag.toString());
    return output;
}