import { Select,Button,message } from "antd";
import { SettingOutlined } from '@ant-design/icons';
import { useState,useCallback,useEffect,memo, useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { getRandom } from "@/utils";
import { getConfig } from "@/utils/config";
import { basename } from 'path';
import StudentsTable from "@/views/StudentTable";
interface Datas {
    name: string;
    data: [[string, string, string | number]];
}
const { filePaths, duration } = getConfig();
let _timeout:NodeJS.Timeout[] = [],
    groupNames:string[],
    selectedNames:string[],
    RandomNames:string[];
const excelNames = filePaths.map((item,index)=>{
  return {
    label:basename(item),
    url:item,
    value:index
  }
})
const ReadFile = async (fileIndex:string,messageApi:any) => {
    const result: Datas[] = await readXlsxFile(filePaths[Number(fileIndex)]).catch(err=>{
      console.log(err)
     return messageApi.open({
        type:"error",
        content:`找不到文件${filePaths[Number(fileIndex)]}`,
        duration:5
      })
    });
    const data = result.filter((item) => item.name === "Sheet1");
    data[0].data.splice(0, 1);
    if (data && data[0]) {
      const names = data[0].data.map((item) => {
        return item[1];
      });
      groupNames = names;
      setRandomNames();
    }
};
const setRandomNames = ()=>{
   RandomNames = getRandom(groupNames);
}
const options = Array.from({length:5}).map((i,index)=>{
    let _val = Number(index) + 1;
    return { label:_val+'人',value:_val }
})
const startRandomNames = (names:any,_set:any)=>{
    let i = 0;
    _timeout[_timeout.length] = setInterval((): any => {
      i++;
      if(i===names.length)i=0;
      _set(names[i]);
    }, 50);
}
const RandomName:React.FC<any> = memo(forwardRef(({data},ref)=>{
  //console.log("randomName render")
  const [current,setCurrent] = useState<string>("");
  const status = useRef(false);
  useEffect(()=>{
   if(data&&data[0]){
    setCurrent(data[0])
   }
  },[data])
  useImperativeHandle(ref,()=>({
    start:()=>{
      if(status.current){
        return;
      }
    //  console.log('start')
      status.current = true;
      startRandomNames(data,setCurrent);
    },
    stop:()=>{
      status.current = false;
    },
  }))
    return (
       <>
       <div style={{fontSize:'70px'}}>{current}</div>
      </>
    )
}))
const SelectGroups:React.FC<{handleSelChange:any,handleFileChange:any,handleOpenDrawer:()=>void}> = memo(({handleSelChange,handleFileChange,handleOpenDrawer})=>{
    //console.log("selectgroups render");
    return (
       <>
       <div
        className="select" style={{display:"flex",justifyContent:"space-between"}}>
         <div>
           <Select 
            defaultValue={"1人"}
            onChange={handleSelChange}
            options={options}></Select>
            <Select style={{marginLeft:"20px"}}
              defaultValue={excelNames[0].label}
              onChange={handleFileChange}
              options={excelNames}></Select>
         </div>
          
        <div>
          <SettingOutlined onClick={handleOpenDrawer} style={{fontSize:"22px",cursor:"pointer"}} />
        </div>
       </div>
      </>
    )
})
const Page:React.FC = ()=>{
    const [group,setGroup] = useState("1");
    const [names,setNames] = useState<string[][]>([RandomNames]);
    const [ drawerStatus,setDrawerStatus ] = useState<boolean>(false);
    const RandomNameRef = useRef<any>([]);
    const [fileIndex,setFileIndex] = useState("0");
    const [messageApi, contextHolder] = message.useMessage();
   // console.log('page render')
    useEffect(()=>{
        const getFile = async ()=>{
            await ReadFile(fileIndex,messageApi);
            handleGroupChange(group);
        }
        getFile();
    },[fileIndex])
    const  handleStart =useCallback(()=>{
      for(let item of RandomNameRef.current){
        item.start()
      }
    },[])
    const handleOpenDrawer = useCallback(()=>{
      setDrawerStatus(true)
    },[])
    const handleCloseDrawer = useCallback(()=>{
      setDrawerStatus(false);
    },[])
    const handleStop=()=>{
     // clearInterval(_timeout);
     for(let item of _timeout){
      clearInterval(item)
     }
     _timeout = [];
     for(let item of RandomNameRef.current){
       item.stop()
     }
      setRandomNames();
    }
    const handleGroupChange = useCallback((value:string)=>{
      const _value =Number(value),remainder = RandomNames.length % _value,_names:string[][]=[];
     // console.log(RandomNames)
      const full_len = RandomNames.length - remainder;
      const section = full_len / _value;
      let i = 0,k=0;
      while(i < full_len){
        _names[k] = _names[k]||[];
        _names[k].push(RandomNames[i]);
        i++;
        if(!(i % section)){
          k++
        }
      }
      const remainderPeople = remainder>0?RandomNames.slice(-1*remainder):[];
      i = 0;
      remainderPeople.forEach((item)=>{
        _names[i].push(item)
        i++
        if(i==_names.length){
            i = 0;
        }
      })
      //console.log(names);
      setNames(_names);
      setGroup(value);
    },[])
    const handleFileChange = useCallback((value:string)=>{
      setFileIndex(value)
      console.log(value)
    },[])
    return (<div className="main">
    {contextHolder}
    <SelectGroups handleSelChange={handleGroupChange} handleFileChange={handleFileChange} handleOpenDrawer={handleOpenDrawer} ></SelectGroups>
    <div style={{display:'flex',justifyContent:'center'}}>
    {names.map((item,index)=><div key={index}  style={{margin:"0 20px"}}>
      <RandomName ref={(ref:any)=>{
      RandomNameRef.current[index] = ref;
      }} data={item}></RandomName>

     </div>)}
    </div>
    <div style={{position:"absolute",bottom:"150px"}}>
            <Button size="large" style={{marginRight:"10px"}} type="primary" onClick={handleStart}>开始</Button>
            <Button size="large" onClick={handleStop}>暂停</Button>
    </div>
    <StudentsTable open={drawerStatus} close={handleCloseDrawer} filePath={filePaths[Number(fileIndex)]}></StudentsTable>
</div>)
}
export default Page;