import { readFileSync,writeFile } from 'node:fs';
import xlsx from 'node-xlsx';
type ExcelData = {
    name: string;
    data: (string|number)[][];
}[]
export function readXlsx(path:string):Promise<ExcelData>{
    return new Promise((resolve,reject)=>{
       // const path 
       try{
        const result = readFileSync(path);
        const data = xlsx.parse(result);
         resolve(data);
       }catch(err){
        reject(err)
       }
    })
}