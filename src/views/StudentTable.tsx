import React, { useState,useEffect, memo } from 'react';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Button, Drawer, Radio, Space,Table } from 'antd';
import { readXlsx } from '@/utils/read';
import { basename } from 'path';
import { StudentData } from '@/store/modules/app';
const { Column, ColumnGroup } = Table;

const EditRow:React.FC= (props)=>{
    console.log(props)
    return <>
    </>
}
const StudentsTable: React.FC<{open:boolean,filePath:string,close:()=>void}> = memo(({open,filePath,close}) => {
    const [placement, setPlacement] = useState<DrawerProps['placement']>('left');
    const [tableData, setTableData] = useState<StudentData[]>([]);
    useEffect(()=>{
      readXlsx(filePath).then((res)=>{
         const sheet1Data =  res.filter(item=>item.name==='Sheet1');
         sheet1Data[0].data&&sheet1Data[0].data.splice(0,1)
        const data = sheet1Data[0].data.map(item=>{
            const [ _class,name,score ] = item;
            return {
                key:name,name,
                score,
                fail:0,
                pass:0,
                total:0,
                class:_class,
                probability:0,
            }
         })
         setTableData(data);
         console.log(data)
      })
    },[filePath])
    return (
      <>
        <Drawer
        width={"50%"}
          title={"点名记录"+`(${basename(filePath)})`}
          placement={placement}
          closable={false}
          open={open}
          key={placement}
          onClose={close}
        >
        <Table dataSource={tableData} pagination={false}>
            <Column title="姓名" dataIndex={"name"}>

            </Column>
            <Column title="班级" dataIndex={"class"}></Column>
            <Column title="分数" dataIndex={"score"}></Column>
            <Column title="未通过" dataIndex={"fail"}></Column>
            <Column title="已通过" dataIndex={"pass"}></Column>
            <Column title="总数" dataIndex={"pass"}></Column>
            <Column title="概率" dataIndex={"pass"} render={EditRow}></Column>
        </Table>
        </Drawer>
      </>
    );
  })

export default StudentsTable;