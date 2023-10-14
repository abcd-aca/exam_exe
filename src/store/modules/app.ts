import { createAction,createReducer } from "@reduxjs/toolkit";
import moment from 'moment';
interface Student {key:React.Key,
    name:string,
    score:string | number,
    fail:number,
    pass:number,
    total:number,
    class:string | number}
export interface StudentData{
    [i:number]:Student
}
export interface StudentsData {
    [key:string]:StudentData[]
}
interface AppData{
    students:StudentData
}
const appData = {
    students:{}
} as AppData;
const getKeys = ()=>Object.keys(appData.students).map(key=>key);
const setStudents = createAction<StudentsData>("app/setStudents");
const updateStudent = createAction("app/updateStudent",function prepare(key:ReturnType<typeof getKeys>,data:Student){
    return {
        payload:{
            key,
            data,
            update_time:moment(new Date(),"YYYY-MM-DD HH:mm:ss")
        }
    }
});
const appReducer = createReducer<AppData>(appData,(builder)=>{
        builder
        .addCase(setStudents,(state,action)=>{
    
        })
        .addCase(updateStudent,(state,action)=>{
            
        })
        .addDefaultCase((state,action)=>{
    
        })
})
// ,(builder)=>{
//     builder
//     .addCase(setStudents,(state,action)=>{

//     })
//     .addCase(updateStudent,(state,action)=>{

//     })
//     .addDefaultCase((state,action)=>{

//     })

// }