import { readFileSync,writeFile } from 'node:fs';
import xlsx from 'node-xlsx';
export function readXlsxData(path:string){
    return new Promise((resolve,reject)=>{
       // const path 
       const result = readFileSync(path);
       const data = xlsx.parse(result);
       resolve(data);
    })
}