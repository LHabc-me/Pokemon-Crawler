const {getMoveInfo} = require('./getMoveInfo.js');
const {getPokeInfo} = require('./getPokeInfo.js');
const {getItemInfo} = require('./getItemInfo.js');
const fs = require('./tools/FS.js');

async function main() {
    let itemInfo = await getItemInfo();
    let pokeInfo = await getPokeInfo();
    let moveInfo = await getMoveInfo();

    fs.writeSync('../data/itemInfo.json', JSON.stringify(itemInfo, null, 4), {flag: 'w+'});
    fs.writeSync('../data/pokeInfo.json', JSON.stringify(pokeInfo, null, 4), {flag: 'w+'});
    fs.writeSync('../data/moveInfo.json', JSON.stringify(moveInfo, null, 4), {flag: 'w+'});
}

let now = Date.now();

main().then(() => {
    console.log(`数据获取完成，耗时${(Date.now() - now) / 1000}秒`)
});