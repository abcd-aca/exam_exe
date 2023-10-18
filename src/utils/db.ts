import { Low } from 'lowdb';
import { JSONFile,JSONFileSync } from 'lowdb/node';
import type { Student,StudentsData,StudentData } from '@/store/modules/app';
import { Crypto } from './crypto';
export default class Db<T extends any>{
    db;crypto;data:Record<string,T> = {};
    constructor(path:string){
        let baseData = {};
        try{
            baseData =  new JSONFileSync<Record<string,string>>(path).read() as Record<string,string>
        }catch{}
       // this.baseData = new JSONFile<Record<string,string>>(path);//new Low<Record<string,string>>(JSONFile(path));
        this.db = new Low<Record<string,string>>(new JSONFile(path),baseData);
        this.crypto = new Crypto();
    }
    async set(data:T,key:string){
    }
    async insert(key:string,data:T){
        (this.db.data as any)[key] =await this.crypto.encrypt(JSON.stringify(data));
        await this.db.write();
        const result = await this.getData();
        return result;
    }
    async getData(){
        let _arr:any = {};
        for(let key in this.db.data){
                const jsonstr = await this.crypto.decrypt(this.db.data[key]) as string;
                _arr[key] =JSON.parse(jsonstr) as T as any;
        }
        this.data = _arr;
        return _arr;
    }
    async delete(id:string){
       const ids = Object.keys(this.db.data);
       if(id){
      //  console.log(id)
            delete this.db.data[id];
       }
       //console.log(this.db.data)
       await this.db.write();
    }
    // get data(){
    //     let _arr:Record<string,string> = {};
    //     for(let key in this.db.data){
    //         _arr[key] = this.crypto.decrypt(JSON.parse(this.db.data[key]))
    //     }
    //     return ;
    // }
    // findById(id:number):Entity{
    //     return [] as Entity;
    // }
    // updateById(id:number,data:Partial<Entity>){

    // }
}