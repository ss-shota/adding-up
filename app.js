'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();
rl.on('line', lineString => {
  const colums = lineString.split(',');
  const year = parseInt(colums[0]);
  const prefecture = colums[1];
  const popu = parseInt(colums[3]);
  if (year === 2010 || year === 2015){
    let value = prefectureDataMap.get(prefecture);
    if(!value){ //値がなければ実行
      value = { //オブジェクト
        popu2010: 0, //popu2010に空のデータを入れている
        popu2015: 0, //popu2015に空のデータを入れている
        change: null //changeに空のデータを入れている
      };
    }
    if(year === 2010){
        value.popu2010 = popu;
    }
    if(year === 2015){
        value.popu2015 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close',() => {
  for(const [key,value] of prefectureDataMap){
    value.change = value.popu2015 / value.popu2010;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
    return pair2[1].change - pair1[1].change;
  });
    const rankingStrings = rankingArray.map(([key, value]) => {
      return (
        key + ':' + value.popu2010 + ' => ' + value.popu2015 + '変化率：' + value.change
      );
    });
    console.log(rankingStrings);
});
