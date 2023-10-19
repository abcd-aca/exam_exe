import { Select, Button, message, List,Popconfirm, Space,Empty } from "antd";
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
import { setStudents, initStudents } from "@/store/modules/app";
import { StudentsData } from "@/store/modules/app";
import StudentsTable from "@/views/StudentTable";
import {RandomName} from './RandomName';
import Header from "./header";
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
  fileList:StudentsData
}
export type randomItem = {key:string,name:string};
const SelectGroups: React.FC<SelectGroupsProps> = memo(
  ({
    handleSelChange,
    handleFileChange,
    handleOpenDrawer,
    handleOpenSetting,
    fileList
  }) => {
    const [ ListNames,setListNames ] = useState<TypeListNames[]>([]);
    useEffect(()=>{
      let _ListNames:TypeListNames[];
      _ListNames = Object.values(fileList).map(item=>{
        return {
          label:item.name,
          value:item.id
        }
      }); 
      setListNames(_ListNames);
      _ListNames[0]&&handleFileChange(_ListNames[0].value)
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
            {/* <SettingOutlined style={{fontSize:"22px",cursor:"pointer"}} /> */}
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
  const [names, setNames] = useState<randomItem[][]>([]);
  const [fileList, setFileList] = useState<StudentsData>({});
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [settingStatus, setSettingstatus] = useState(false);
  const RandomNameRef = useRef<any[]>([]);
  const RandomNames = useRef<randomItem[]>([]);
  const timeoutList = useRef<NodeJS.Timeout[]>([]);
  const groupNames = useRef<randomItem[]>([]);
  const [fileIndex, setFileIndex] = useState("0");
  const [messageApi, contextHolder] = message.useMessage();
  const appState = useAppSelector(state=>state.appReducer);
  // console.log('page render')
  const setRandomNames = () => {
    RandomNames.current = getRandom(groupNames.current);
  };
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
    const keys = Object.keys(appState.students);
    if(appState.students){
      setFileList(appState.students)
    }
    if(names.length==0&&keys.length>0){
        groupNames.current = appState.students[keys[0]].data.map(({id,name})=>{
          return {
            key:String(id),name
          }
        });
        setRandomNames();
        handleGroupChange(group);
    }else if(keys.length == 0){
      groupNames.current = [];
      setRandomNames();
      handleGroupChange(group);
    }
  },[appState])
  const handleStart = useCallback(() => {
    for (let item of RandomNameRef.current) {
      item.start();
    }
  }, []);
  const handleStop = () => {
    for (let item of timeoutList.current) {
      clearInterval(item);
    }
    timeoutList.current = [];
    for (let item of RandomNameRef.current) {
      item.stop();
    }
    setRandomNames();
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
  const handleGroupChange = useCallback((value: string) => {
    const _value = Number(value),
      remainder = RandomNames.current.length % _value,
      _names: randomItem[][] = [];
    const full_len = RandomNames.current.length - remainder;
    const section = full_len / _value;
    let i = 0,
      k = 0;
    while (i < full_len) {
      _names[k] = _names[k] || [];
      _names[k].push(RandomNames.current[i]);
      i++;
      if (!(i % section)) {
        k++;
      }
    }
    const remainderPeople =
      remainder > 0 ? RandomNames.current.slice(-1 * remainder) : [];
    i = 0;
    remainderPeople.forEach((item) => {
      _names[i].push(item);
      i++;
      if (i == _names.length) {
        i = 0;
      }
    });
    setNames(_names);
    setGroup(value);
  }, []);
  const handleFileChange = useCallback((value: string,val2?:string) => {
    if(value === "init"){
      !fileIndex&&setFileIndex(val2||"")
    }else{
      
     setFileIndex(value);
    }
  }, []);
  return (
    <div className='main'>
      {contextHolder}
      <Header />
      <SelectGroups
        fileList={fileList}
        handleSelChange={handleGroupChange}
        handleFileChange={handleFileChange}
        handleOpenDrawer={handleOpenDrawer}
        handleOpenSetting={setSettingstatus}
      ></SelectGroups>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {names.map((item, index) => (
          <div key={index} style={{ margin: "0 20px" }}>
            <RandomName
              ref={(ref: any) => {
                RandomNameRef.current[index] = ref;
              }}
              data={item}
              timeoutList={timeoutList}
            ></RandomName>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: "150px",display:names.length<=0&&'none'||'' }}>
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
        fileId={fileIndex}
        fileList={fileList}
      ></StudentsTable>
      <div id='stars'></div>
<div id='stars2'></div>
<div id='stars3'></div>
    </div>
  );
};
export default Page;
