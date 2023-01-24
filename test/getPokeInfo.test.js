const fs = require("fs");
const {getPokeInfo} = require("../src/getPokeInfo.js");

async function test() {
    let arr = await getPokeInfo();
    for (let i = 0; i < arr.length; i++) {
        fs.writeFileSync(`../temp/poke/${arr[i].id + ' ' + arr[i].name}.txt`, arr[i].parsed, {flag: "w+"});
    }
}

test();