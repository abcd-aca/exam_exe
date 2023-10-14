export function getRandom<T extends any>(list:T[]):T[]{
    let _randomList = [],_list = [...list];
    while(_list.length>0){
       const index = Math.floor(Math.random()*_list.length);
       _randomList.push(_list[index]);
       _list.splice(index,1)
    }
    return _randomList;
}