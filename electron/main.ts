import { app,BrowserWindow,Menu,ipcMain } from "electron";
import { readXlsxData } from './stream/file';
import { join } from 'node:path';
process.env.DIST_ELECTRON = join(__dirname, '../dist')
//process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
const indexHtml = join(process.env.DIST_ELECTRON, 'index.html');
const url = process.env.NODE_ENV ==='development'?'http://127.0.0.1:7777/':indexHtml;
const createWindow = ()=>{
    const win = new BrowserWindow({
        width:900,
        height:800,
        title:"十一完",
        icon:join(__dirname,"../favicon.ico"),
        frame:false,
        //fullscreen:true,
       // titleBarStyle:"hidden",
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            preload:join(__dirname,"./index.js"),
        },
       // backgroundColor:"#333"
    })
   win.loadURL(url);
    if(process.env.NODE_ENV==="development"){
        win.webContents.openDevTools();
    }
   // win.webContents.openDevTools();
    ipcMain.handle("FullScreen",(event,type:boolean)=>{
        win.fullScreen = type;
    })
    ipcMain.handle("MiniScreen",()=>{
        win.minimize();
    })
    ipcMain.handle("CloseScreen",()=>{
        win.close();
    })
    //win.setMenu(null)
    //win.autoHideMenuBar(true);
}

app.whenReady().then(()=>{
    Menu.setApplicationMenu(null);
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
