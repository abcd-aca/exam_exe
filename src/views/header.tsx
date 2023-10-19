import { FullscreenOutlined,MinusOutlined,FullscreenExitOutlined,CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import "@/views/styles/header.scss";
const Header:React.FC = ()=>{
    const [ fullScreen,setFullScreen ] = useState(false);
    const handelMiniScreen = ()=>{
        console.log(111)
        MiniScreen();
    }
    const handelCloseScreen = ()=>{
        console.log(222)
        CloseScreen();
    }
    const handleFullScreen = (type:boolean)=>{
        console.log(333)
        setFullScreen(type);
        FullScreen(type);
    }
    return <>
    <div className='header'>
            <MinusOutlined className='icon' onClick={handelMiniScreen} />
            {fullScreen?<FullscreenExitOutlined className='icon' onClick={()=>{handleFullScreen(false)}} />:<FullscreenOutlined className='icon' onClick={()=>{handleFullScreen(true)}} />}
            <CloseOutlined className='icon' onClick={handelCloseScreen}  />
    </div></>
}
export default Header;