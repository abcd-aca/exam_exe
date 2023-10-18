import { App } from "@/enums";
import { scrypt,randomFill,createCipheriv,createDecipheriv } from 'node:crypto';
import { Cipher,Decipher,randomBytes } from 'node:crypto';
export class Crypto{
    algorithm="aes-128-cbc";
    //securityKey="for generate key";salt = "salt";
    iv = new Buffer("abcdesdgenerated","utf-8");//randomBytes(16);
    Securitykey = new Buffer("lskdjahsduaisoas","utf-8");
    constructor(){  
    }
    // getKeyAndIv():Promise<{key:Buffer,iv:Uint8Array}>{
    //     return new Promise((resolve)=>{
    //             scrypt(this.securityKey,this.salt,24,(err,key)=>{                    
    //                 if(err)throw err;
    //                 randomFill(new Uint8Array(16),(err,iv)=>{
    //                     if (err) throw err;
    //                     resolve({ key, iv });
    //                 })
    //             })
    //     })
    // }
    async encrypt(data:string){
        //console.log(this.iv)
         const cipher = createCipheriv(this.algorithm, this.Securitykey, this.iv);
        let encrypted=  cipher.update(data,'utf-8','hex');
        encrypted += cipher.final("hex");
       // console.log(encrypted)
        return encrypted;
    }
    async decrypt(encrypted:string){
        const decipher = createDecipheriv(this.algorithm, this.Securitykey, this.iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
         decrypted += decipher.final("utf-8");
         //console.log(decrypted)
         return decrypted as unknown;
    }
}