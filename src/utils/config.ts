import { readFileSync } from "node:fs";
import { resolve } from 'path';
import { parse } from "ini";
type Config = Record<string,string>;
interface _Config {
    filePaths:string[],
    duration:number|string,
}
export function getConfig():_Config{
  //  console.log(process.env);
    let configFilePath:string;
    if(process.env.NODE_ENV === "development"){
        configFilePath = `C:/Users/29305/Desktop/projects/exam_pc/config.ini`
    }else{
        configFilePath = resolve(__dirname,"../../../config.ini")
    }
    let result = parse(readFileSync(configFilePath,{encoding:"utf-8"}));
    let baseConfig:_Config = {
        filePaths:[""],
        duration:"",
    };
    if(result&&result.filePaths){
        baseConfig.filePaths = (<string>result.filePaths).split(",");
        baseConfig.duration = parseInt(result.duration);
    }
    return baseConfig;
}