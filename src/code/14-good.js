function main(arg){
  let map = {
    'A':{
      fn: fnA,
      arg: argA
    },
    'B':{
      fn: fnB,
      arg: argB
    },
    'C':{
      fn: fnC,
      arg: argC
    },
    'D':{
      fn: fnD,
      arg: argD
    },
    'E':{
      fn: fnE,
      arg: argE
    },
  };
  let item = map[arg];
  if(item){
    item.fn(item.arg);
  }else{
    fnDefault(argDefault);
  }
}
main('A');
