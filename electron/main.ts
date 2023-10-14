import { app,BrowserWindow,Menu,ipcMain } from "electron";
import { readXlsxData } from './stream/file';
import { join } from 'node:path';
process.env.DIST_ELECTRON = join(__dirname, '../dist')
//process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
const indexHtml = join(process.env.DIST_ELECTRON, 'index.html');
const url = process.env.NODE_ENV ==='development'?'http://127.0.0.1:7777/':indexHtml;
const createWindow = ()=>{
    const win = new BrowserWindow({
        width:800,
        height:600,
        title:"随机点名",
        icon:join(__dirname,"../favicon.ico"),
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            preload:join(__dirname,"./index.js"),
        }
    })
   win.loadURL(url);
    if(process.env.NODE_ENV==="development"){
        win.webContents.openDevTools();
    }
}

Menu.setApplicationMenu(null);
app.whenReady().then(()=>{
    ipcMain.handle('readfile',(event,path:string)=>{
        return readXlsxData(path)
    })
    createWindow();
    app.on('activate',()=>{
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
//关闭窗口判断不是在macos上运行调用app.quit
app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin') app.quit();
})
