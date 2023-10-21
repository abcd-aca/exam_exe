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
export function randomZeroBetween(x:number){
    return Math.floor(Math.random() * x)
}
export function awaitLoopPromise(){

}

    // const _value = Number(value),
    //   remainder = groupNames.current.length % _value,
    //   _names: randomItem[][] = [];
    // const full_len = groupNames.current.length - remainder;
    // const section = full_len / _value;
    // let i = 0,
    //   k = 0;
    // while (i < full_len) {
    //   _names[k] = _names[k] || [];
    //   _names[k].push(groupNames.current[i]);
    //   i++;
    //   if (!(i % section)) {
    //     k++;
    //   }
    // }
    // const remainderPeople =
    //   remainder > 0 ? groupNames.current.slice(-1 * remainder) : [];
    // i = 0;
    // remainderPeople.forEach((item) => {
    //   _names[i].push(item);
    //   i++;
    //   if (i == _names.length) {
    //     i = 0;
    //   }
    // });
   // setNames(_names);