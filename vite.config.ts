import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronrender from 'vite-plugin-electron-renderer'
const _resolve = (path:string)=>resolve(__dirname,path);
export default defineConfig({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins:[
        react({
            
        }),
        electron([{
            entry:'electron/main.ts',
            onstart(options) {
                if (process.env.VSCODE_DEBUG) {
                  console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
                } else {
                  options.startup()
                }
              },
        
        },{
            entry: 'electron/preload/index.ts',
            onstart({ reload }) {
                // Notify the Renderer process to reload the page when the Preload scripts build is complete, 
                // instead of restarting the entire Electron App.
                reload()
              },
        }]),
        electronrender()
    ],
    resolve:{
        alias:{
            "@":_resolve("./src")
        }
    },
    server:{
       host:"0.0.0.0",
        port:7777
    }
})