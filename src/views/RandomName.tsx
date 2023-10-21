import { memo,forwardRef,useState,useRef,useEffect,useImperativeHandle } from "react";
import { Popconfirm } from 'antd';
import type { randomItem } from "."; 
export const RandomName: React.FC<any> = memo(
    ({current}) => {
      //console.log("randomName render")
      //const [current, setCurrent] =useState<randomItem>({} as randomItem);;
      const [open, setOpen] = useState(false);
      const [mark,setMark] = useState("");
      const status = useRef(false);
      const onConfirm = ()=>{
        setMark("pass")
        setOpen(false)
      }
      const onFail = ()=>{
        setMark("fail")
        setOpen(false)
      }
      // const startRandomNames = (names: any, _set: any) => {
      //   let i = 0;
      //   timeoutList.current[timeoutList.current.length] = setInterval((): any => {
      //     i++;
      //     if (i === names.length) i = 0;
      //     _set(names[i]);
      //   }, 50);
      // };
      // useEffect(() => {
      //   if (data && data[0]) {
      //     setCurrent(data[0]);
      //   }
      // }, [data]);
      // useEffect(()=>{
      //   setMark("")
      // },[current])
      // useImperativeHandle(ref, () => ({
      //   start: () => {
      //     if (status.current) {
      //       return;
      //     }
      //     status.current = true;
      //     startRandomNames(data, setCurrent);
      //   },
      //   stop: () => {
      //     status.current = false;
      //   },
      // }));
      return (
        <>
        <Popconfirm
          title="是否通过?"
          onConfirm={onConfirm}
          onCancel={onFail}
          open={open}
          okText="通过"
          cancelText="未通过"
        >
          <div className={"text-white " + mark} onClick={()=>{!mark&&setOpen(true)}} style={{ fontSize: "70px" }}>{current.name}</div>
          {/* <Space>
            <Button styles={} type="primary">通过</Button>
            <Button type="primary" danger>未通过</Button>
          </Space> */}
        </Popconfirm>
        </>
      );
    }
  );