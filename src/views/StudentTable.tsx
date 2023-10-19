import '@/views/styles/studenttable.scss';
import React, { useContext, useEffect, useRef, useState, memo } from "react";
import {
  Button,
  Drawer,
  Radio,
  Space,
  Table,
  Form,
  Input,
  Popconfirm,
  InputNumber,App
  
} from "antd";
import { useAppDispatch } from '@/hooks/dispatch';
import { updateStudent } from '@/store/modules/app';
import type { DrawerProps, RadioChangeEvent, InputRef } from "antd";
import type { FormInstance } from "antd/es/form";
import type { ColumnsType } from "antd/es/table";
import type { StudentData, StudentsData, Student } from "@/store/modules/app";
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Student;
  record: Student;
  handleSave: (record: Student) => void;
}
const { Column, ColumnGroup } = Table;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<{ index: number }> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
 // const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  // useEffect(() => {
  //   if (editing) {
  //     inputRef.current!.focus();
  //   }
  // }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title}不能为空`,
          },
        ]}
      >
        <InputNumber
            min={0}
            max={100}
            formatter={(value) => `${Number(value)?.toFixed(1)}%`}
            decimalSeparator="1"
            step="0.2"
            parser={(value) => Number(value!.replace('%', '')).toFixed(1) as any}
            onPressEnter={save} onBlur={save}
          />
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const StudentsTable: React.FC<{
  open: boolean;
  fileId: string;
  fileList: StudentsData;
  close: () => void;
}> = memo(({ open, fileId, close, fileList }) => {
  const [placement, setPlacement] = useState<DrawerProps["placement"]>("left");
  const [dataSource, setDataSource] = useState<StudentData>([]);
  const [tableName, setTableName] = useState("");
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  useEffect(() => {
    if (fileList[fileId]) {
      const { name, data } = fileList[fileId];
      setTableName(name);
      setDataSource(data);
    }
  }, [fileList, fileId]);

  const getSorter = (key: string, multiple: number = 1) => {
    return {
      compare: (a: any, b: any) => a[key] - b[key],
      multiple,
    };
  };
  
  type EditableTableProps = Parameters<typeof Table>[0];
  type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleSave = async (row: Student) => {
    console.log(row);
    try{
    const result = await dispatch(updateStudent({id:fileId,data:row}));
    if(result.meta.requestStatus !== "fulfilled"){
      return message.error("设置失败")
    }
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    }catch(err){
      message.error("设置失败")
    }
  };
  const defaultColumns:(ColumnTypes[number] & { editable?: boolean; dataIndex: string })[]= [
    {
      title:"姓名",
      dataIndex:"name",
    },
    {
      title:"班级",
      dataIndex:"_class",
    },
    {
      title:"分数",
      dataIndex:"score",
      sorter:getSorter("score"),
    },
    {
      title:"未通过",
      dataIndex:"fail",
      sorter:getSorter("fail"),
    },
    {
      title:"已通过",
      dataIndex:"pass",
      sorter:getSorter("pass"),
    },
    // {
    //   title:"全部",
    //   dataIndex:"total",
    //   sorter:getSorter("total"),
    // },
    {
      title:"概率",
      dataIndex:"chance",
      sorter:getSorter("chance"),
      editable:true,
      render(value, record, index) {
          return <div>
              {value>0?value.toFixed(1)+"%":value}
          </div>
      },
      onCell:(record)=>{
        return ({
          record,
          dataIndex:"chance",
          title:"概率",
          handleSave,editable:true
       })
      }
    },
    {
      title:"单次概率",
      dataIndex:"onechance",
      sorter:getSorter("onechance"),
      editable:true,
      render(value, record, index) {
          return <div>
              {value>0?value.toFixed(1)+"%":value}
          </div>
      },
      onCell:(record)=>{
        return ({
          record,
          dataIndex:"onechance",
          title:"概率",
          handleSave,editable:true
       })
      }
    }
  ]
  return (
    <>
      <Drawer
        width={"50%"}
        title={tableName+"点名记录"}
        placement={placement}
        closable={false}
        open={open}
        key={placement}
        onClose={close}
      >
        <Table
        sticky={true}
        pagination={{ pageSize: 100 }}
        components={components}
        rowKey="id" 
        tableLayout='fixed'
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={defaultColumns as ColumnTypes}
      />
      </Drawer>
    </>
  );
});

export default StudentsTable;
