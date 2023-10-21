import { Select, Button, message, List,Popconfirm, Space,Empty,Switch } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/hooks/dispatch";
import {
  useState,
  useCallback,
  useEffect,
  memo,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getRandom } from "@/utils";
import { getConfig } from "@/utils/config";
import { basename } from "path";
import { Setting } from "./Setting";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";
import { setStudents, initStudents,updateStudent } from "@/store/modules/app";
import { StudentsData } from "@/store/modules/app";
import StudentsTable from "@/views/StudentTable";
import {RandomName} from './RandomName';
import Header from "./header";
import { randomZeroBetween } from "@/utils";
// import {  } from

interface Datas {
  name: string;
  data: [[string, string, string | number]];
}
interface TypeListNames{
  label:string,value:string
}
// const { filePaths, duration } = getConfig();
const options = Array.from({ length: 5 }).map((i, index) => {
  let _val = Number(index) + 1;
  return { label: _val + "人", value: _val };
});
interface SelectGroupsProps {
  handleSelChange: (x: string) => any;
  handleOpenSetting: (x: boolean) => any;
  handleFileChange: (x: string) => any;
  handleOpenDrawer: () => any;
  fileList:StudentsData,
  fileId:string
}
export type randomItem = {id:string,name:string,chance:number,onechance:number};
const SelectGroups: React.FC<SelectGroupsProps> = memo(
  ({
    handleSelChange,
    handleFileChange,
    handleOpenDrawer,
    handleOpenSetting,
    fileList,fileId
  }) => {
    const [ ListNames,setListNames ] = useState<TypeListNames[]>([]);
    useEffect(()=>{
      let _ListNames:TypeListNames[];
      let hasCurrentId = false;
      _ListNames = Object.values(fileList).map(item=>{
        if(item.id === fileId)hasCurrentId = true;
        return {
          label:item.name,
          value:item.id
        }
      }); 
      setListNames(_ListNames);
      _ListNames[0]&&!hasCurrentId&&handleFileChange(_ListNames[0].value)
    },[fileList])
    //console.log("selectgroups render");
    return (
      <>
        <div
          className='select'
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <Select
              defaultValue={"1人"}
              onChange={handleSelChange}
              options={options}
            ></Select>
            <Select
              style={{ marginLeft: "20px" }}
              defaultValue={ListNames[0]?.value}
              onChange={handleFileChange}
              options={ListNames}
              key={ListNames[0]?.label}
            ></Select>
          </div>

          <div style={{display:"flex"}}>
            <Button
              type='primary'
              style={{ marginRight: "20px" }}
              onClick={() => {
                handleOpenSetting(true);
              }}
            >
              名单管理
            </Button>
            <SettingOutlined
              onClick={handleOpenDrawer}
              style={{ fontSize: "22px", cursor: "pointer",color:"#fff" }}
            />
          </div>
        </div>
      </>
    );
  }
);
const Page: React.FC = () => {
  const [group, setGroup] = useState("1");
  const dispatch = useDispatch<AppDispatch>();
  const [fileList, setFileList] = useState<StudentsData>({});
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [settingStatus, setSettingstatus] = useState(false);
  const [ activeNames,setActiveNames ] = useState<randomItem[]>([])
  const timeoutList = useRef<NodeJS.Timeout|null>(null);
  const groupNames = useRef<randomItem[]>([]);
  const [fileId, setFileId] = useState("0");
  const [messageApi, contextHolder] = message.useMessage();
  const appState = useAppSelector(state=>state.appReducer);
  interface ChanceNamesType {
    hasChance:randomItem[],
    hasOneChance:randomItem[],
    students:randomItem[]
  }
  const chanceNames = useRef<ChanceNamesType>({} as ChanceNamesType);
  // console.log('page render')
  useEffect(()=>{ 
    const getFile = async () => {
      try {
        const reuslt = await dispatch(initStudents()).unwrap();
      } catch (err) {
        messageApi.error("文件读取失败");
        console.log(err);
      }
   };
   getFile();
  },[])
  useEffect(()=>{
    if(fileId!="0"){
      setGroupNames();
      setChanceNames();
      setAllRandom(Number(group));
    }
  },[fileId])
  useEffect(()=>{
    const keys = Object.keys(appState.students);
    if(appState.students){
      setFileList(appState.students);
    }
  },[appState])
  const setGroupNames = ()=>{
    try{
      groupNames.current = appState.students[fileId].data.map(({id,name,chance,onechance})=>{
        return {
          id:String(id),name,chance,onechance
        }
      });
    }catch{
      groupNames.current = [];
    }
  }
  const handleStart = () => {
    if(!timeoutList.current){
      timeoutList.current = setInterval(()=>{
        setAllRandom();
      },50)
    }
  }
  const handleStop = () => {
    if(timeoutList.current){
      clearInterval(timeoutList.current!);
      timeoutList.current= null;
      _setActiveNames(Number(group));
    }
  };
  const handleOpenDrawer = useCallback(() => {
    setDrawerStatus(true);
  }, []);
  const handleSettingClose = useCallback(() => {
    setSettingstatus(false);
  }, []);
  const handleCloseDrawer = useCallback(() => {
    setDrawerStatus(false);
  }, []);
  //将全部名字分组
  const handleGroupChange = useCallback((value: string) => {
    setGroup(value);
    setAllRandom(Number(value));
  }, []);
  const handleFileChange = useCallback((value: string,val2?:string) => {
    if(value === "init"){
      !fileId&&setFileId(val2||"")
    }else{
      
     setFileId(value);
    }
  }, []);
  const setChanceNames = ()=>{
    let hasOneChance = [],hasChance = [],students = [];
    for(let item of groupNames.current){
      
      students.push(item)
      if(item.onechance>0){
        hasOneChance.push(item)
      }else if(item.chance>0){
        hasChance.push(item)
      }
    }
    chanceNames.current = {
      hasOneChance,hasChance,students
    }
  }
  type ChanceNamesKeys = keyof ChanceNamesType;
  const deleteChanceNamesById = (id:string,target?:ChanceNamesKeys[])=>{
    let keys  = target?target: Object.keys(chanceNames.current);
     keys.forEach((key)=>{
      const item = chanceNames.current[key as ChanceNamesKeys];
      for(let index in item){
        const val = item[index];
        if(val.id === id){
          item.splice(Number(index),1);
          break;
        }
      }
    })
  }
  //通过名字概率计算出随机名字
  const countRandom = (max:number,groups:randomItem[],chance?:number)=>{
    const random = randomZeroBetween(max);
    // 0 10 15
    let total = 0,current = null; 
    for(let index in groups){
        total += Number(chance||groups[index].chance);
        if(random < total){
          current = index;
          break;
        }
    }
    return groups[Number(current)]  || null;
  }
  //随机全部名字
  const setAllRandom = (len=Number(group))=>{
    let _arr:randomItem[] = Array.from({length:len}) as any;
    
    const names = [...groupNames.current];
   //console.log(len)
    for(let index in _arr){
       const i = randomZeroBetween(names.length);
       //console.log(i);
       _arr[index] = names[i];
       names.splice(i,1);

    }
    setActiveNames(_arr);
  }
  //点击停止根据概率设置当前随机名字
  const _setActiveNames = async (len=Number(group))=>{
    let _arr:randomItem[] = [] as any;
    for(let i = 0;i<len;i++){
       _arr[i] = await getRandomNames();
    }
    setActiveNames(_arr);
    setTimeout(async ()=>{
      for(let item of _arr){
        if(item.onechance===101){
          await dispatch(updateStudent({id:fileId,data:{onechance:0,id:item.id}}));
        }
      }
    })

  }
  //通过概率获取名字
  const getRandomNames = async ()=>{
    if(!chanceNames.current?.students||chanceNames.current?.students.length===0){
      setChanceNames();
    }
    const { hasOneChance,hasChance,students } = chanceNames.current;
    let _student;
    for(let item of hasOneChance){ //单次概率按单人概率/100计算 每个人概率最高100
      _student = countRandom(101,[item],item.onechance);
      _student.onechance = 101;//101标识单次概率已使用
      if(_student){
        break;
      }
    }
    if(!_student){
      //普通概率按所有人单人概率/1000 计算 所有人概率合计1000
      let chanceStudent = countRandom(1001,hasChance)
      _student = chanceStudent?chanceStudent:countRandom(students.length,students,1);
    }
    // console.log(_student)
    deleteChanceNamesById(_student.id);
    return _student;
    
  }
  return (
    <div className='main'>
      {contextHolder}
      <Header />
      <SelectGroups
        fileList={fileList}
        fileId= {fileId}
        handleSelChange={handleGroupChange}
        handleFileChange={handleFileChange}
        handleOpenDrawer={handleOpenDrawer}
        handleOpenSetting={setSettingstatus}
      ></SelectGroups>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {activeNames.map((item, index) => (
          <div key={index} style={{ margin: "0 20px" }}>
            <RandomName current={item} ></RandomName>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: "150px" }}>
        <Button
          size='large'
          style={{ marginRight: "10px" }}
          type='primary'
          onClick={handleStart}
        >
          开始
        </Button>
        <Button size='large' onClick={handleStop}>
          暂停
        </Button>
      </div>
      <Setting close={handleSettingClose} open={settingStatus}></Setting>
      <StudentsTable
        open={drawerStatus}
        close={handleCloseDrawer}
        fileId={fileId}
        fileList={fileList}
      ></StudentsTable>
      <div id='stars'></div>
<div id='stars2'></div>
<div id='stars3'></div>
    </div>
  );
};
export default Page;
