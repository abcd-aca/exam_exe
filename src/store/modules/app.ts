import moment from "moment";
import Db from "@/utils/db";
import {
  createAction,
  createReducer,
  createAsyncThunk,
  nanoid,
} from "@reduxjs/toolkit";
import { readXlsx } from "@/utils/file";
import { RootState } from "..";
export interface Student {
  id: string;
  name: string;
  score: string | number;
  fail: number;
  pass: number;
  total: number;
  class: string | number;
  chance:number,
  onechance:number
}
export type StudentData = Student[];
interface dbData {
    name: string;
    id:string,
    data: Student[];
  }
export interface StudentsData{
  [key:string]:dbData;
} 
interface AppData {
  students: StudentsData;
  database: Db<dbData>;
}
const appData = {
  students: {},
  database: {},
} as AppData;
const getKeys = () => Object.keys(appData.students).map((key) => key);
//export const setStudents = createAction<{filePath,}>("app/setStudents");
//增加提问记录时间 及回答问题
export const updateStudent = createAction(
  "app/updateStudent",
  function prepare(key: ReturnType<typeof getKeys>, data: Student) {
    return {
      payload: {
        key,
        data,
        update_time: moment(new Date(), "YYYY-MM-DD HH:mm:ss"),
      },
    };
  }
);
export const deleteStudents = createAsyncThunk("deleteStudentsStatus",async (id:string,thunkApi)=>{
  try{
    const state = thunkApi.getState() as RootState;
    await state.appReducer.database.delete(id);
    return {
      id
    }
  }catch(err){
    return thunkApi.rejectWithValue(err)
  }
});
export const initStudents = createAsyncThunk(
  "iniStudentStatus",
  async (path: undefined, thunkApi) => {
    try {
      const cryptodb = new Db<dbData>(
        "C:/Users/29305/Desktop/projects/exam_pc/file.json"
      );
      const data = await cryptodb.getData();
      return {
        cryptodb,
        data,
      };
    } catch (err) {
      //console.log(err)
      return thunkApi.rejectWithValue(err);
    }
  }
);
export const setStudents = createAsyncThunk(
  "setStudentStatus",
  async ({ path, fileName }:{ path: string; fileName: string }, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootState;
     // console.log(state)
      const paths = Object.keys(state.appReducer.students);
      const names = paths.map((key) => state.appReducer.students[String(key)].name);
      if (paths.includes(path)) {
        return thunkApi.rejectWithValue({
          code: 0,
          msg: "名单路径重复",
        });
      } else if (names.includes(fileName)) {
        return thunkApi.rejectWithValue({
          code: 0,
          msg: "名单名称重复",
        });
      } else {
        const fileData = await readXlsx(path);
        const studentData = fileData[0].data;
        studentData.splice(0, 1);
        const content: StudentData = studentData.map((item) => {
          const [_class, name, score] = item;
          return {
            class: _class,
            name: name as string,
            score,
            fail: 0,
            pass: 0,
            total: 0,
            id: nanoid(),
            chance:0,
            onechance:0,
          };
        });
        const id = nanoid();
        await state.appReducer.database.insert(id,{
          id,
          name:fileName,
          data:content
        })
        return {
            students:{
                [id]:{
                    name:fileName,
                    id:id,
                    data:content
                  }
            }
        };
      }
    } catch (err) {
      console.log(err)
      return thunkApi.rejectWithValue(err);
    }
  }
);
export const appReducer = createReducer<AppData>(appData, (builder) => {
  builder
    .addCase(setStudents.fulfilled, (state, action) => {
        const { students } = action.payload;
        Object.keys(students).forEach(key=>{
            if(students.hasOwnProperty(key)){
                state.students[key] = students[key];
            }
        })
    })
    .addCase(updateStudent, (state, action) => {

    })
    .addCase(initStudents.fulfilled, (state, action) => {
      const { data, cryptodb } = action.payload;
      state.students = data;
      state.database = cryptodb;
    })
    .addCase(deleteStudents.fulfilled,(state,action)=>{
      for(let key in state.students){
        if(state.students[key].id === action.payload.id){
          delete state.students[key]
        } 
      }
      
    })
    .addDefaultCase((state, action) => {});
});
// ,(builder)=>{
//     builder
//     .addCase(setStudents,(state,action)=>{

//     })
//     .addCase(updateStudent,(state,action)=>{

//     })
//     .addDefaultCase((state,action)=>{

//     })

// }
