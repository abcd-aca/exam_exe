 import { ipcRenderer } from "electron";
// contextBridge.exposeInMainWorld("readXlsxFile",()=>ipcRenderer.invoke("readfile","---value"))
window.readXlsxFile = (path:string)=>ipcRenderer.invoke("readfile",path);
window.FullScreen = (type:boolean)=>ipcRenderer.invoke("FullScreen",type);
window.MiniScreen = ()=>ipcRenderer.invoke("MiniScreen");
window.CloseScreen = ()=>ipcRenderer.invoke("CloseScreen");