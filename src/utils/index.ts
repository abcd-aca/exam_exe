// 数组随机顺序
export function getRandom<T extends any>(list:T[]):T[]{
    let _randomList = [],_list = [...list];
    while(_list.length>0){
       const index = Math.floor(Math.random()*_list.length);
       _randomList.push(_list[index]);
       _list.splice(index,1)
    }
    return _randomList;
}
//根据名单人数随机数据 名单概率
export function getRandomList(groups:any,list:any){
    //60% 
    
    //40
}
function randomZeroBetween(x:number){
    return Math.floor(Math.random() + x)
}
