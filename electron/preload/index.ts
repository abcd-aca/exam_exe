 import { ipcRenderer } from "electron";
// contextBridge.exposeInMainWorld("readXlsxFile",()=>ipcRenderer.invoke("readfile","---value"))
window.readXlsxFile = (path:string)=>ipcRenderer.invoke("readfile",path);