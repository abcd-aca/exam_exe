import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
const db = new Low(new JSONFile('file.json'), null);
export default class Db<Entity>{
    protected data:Entity[] = [];
    constructor(path:string){
        this.set()
    }
    protected async set(){
        this.data =await db.read() as unknown as Entity[];
    }
    write(data:Entity){

    }
    read(){

    }
    findById(id:number):Entity{
        return [] as Entity;
    }
    updateById(id:number,data:Partial<Entity>){

    }
}