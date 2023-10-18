import { Drawer, Button, Form, Input, Upload,App,Spin, Space,Typography,Popconfirm } from "antd";
import type { DrawerProps, UploadFile, UploadProps,PopconfirmProps } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch,useAppSelector } from "@/hooks/dispatch";
import { setStudents,deleteStudents } from "@/store/modules/app";
import '@/views/styles/setting.scss';
interface SettingProps {
  open: boolean;
  close: () => void;
}
interface Files {
  id:string,name:string,path:string
}
export const Setting: React.FC<SettingProps> = ({ open, close }) => {
  const { Text } = Typography;
  const [placement, setPlacement] = useState<DrawerProps["placement"]>("left");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [files,setFiles] = useState<Files[]>([]);
  const [loading,setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const appState = useAppSelector(state=>state.appReducer);
  const { message } = App.useApp();
  const onFinish =async (values: any) => {
    console.log(values);
    const path:string = values.path[0].originFileObj.path;
    setLoading(true)
    const result =await dispatch(setStudents({fileName:values.alias,path}));
    if(result.type==="setStudentStatus/fulfilled"){
      form.resetFields();
      message.success("添加成功")
    }else{
      message.error("添加失败")
    }
    console.log(result)
    setLoading(false)
  };
  const onFinishFailed = (err:any)=>{
    console.log(err)
  }
  const onClose = ()=>{
    form.resetFields();
    setFileList([]);
    if(!loading){    
        close()
    }
  }
  const baseRules = {
    path:[{ required: true, message: "请输入名单名称" }],
    alias:[{ required: true, message: "请选择名单文件" }]
  };
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
     fileList,
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const onDeleteFile = async (item:Files)=>{
    const result = await dispatch(deleteStudents(item.id));
    if(result.meta.requestStatus === "fulfilled"){
      message.success("删除成功")
    }
  }
  useEffect(()=>{
    const _files = Object.keys(appState.students).map(key=>{
      const { id,name  } =appState.students[key];
      return { id,name,path:key }
    })
    setFiles(_files);
  },[appState])
  return (
    <Drawer
      width={"50%"}
      title='名单管理'
      placement={placement}
      closable={false}
      open={open}
      key={placement}
      onClose={onClose}
    >
    <Spin spinning={loading} delay={300} tip="添加中">
      <Form name="basic" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item name={"alias"} label='文件名称' rules={baseRules.path}>
          <Input type='text' placeholder='请输入选择文件时展示名称' />
        </Form.Item>
        <Form.Item
          name={"path"}
          label='上传文件'
          valuePropName='fileList'
          rules={baseRules.alias}
          getValueFromEvent={normFile}
        >
          <Upload {...uploadProps} maxCount={1} accept="xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
            <Button>上传文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            添加
          </Button>
        </Form.Item>
      </Form>
      </Spin>
        {files.map(item=>{
          
          return <div key={item.id} className="file-list" style={{display:"flex",justifyContent:"space-between",width:"100%",alignItems:"center"}}>
          <Space align="center">
            <Text>名单名称：{item.name}</Text>
          </Space>
          <Popconfirm
              title={`是否删除名单${item.name}?`}
              onConfirm={()=>{onDeleteFile(item)}}
              okText="删除"
              
              cancelText="取消"
            >
            <DeleteOutlined className="delete-icon"></DeleteOutlined>
            </Popconfirm>
          </div>
             })}
    </Drawer>
  );
};
