const fs = require("fs");
const {getMoveInfo} = require("../src/getMoveInfo.js");

async function test() {
    let arr = await getMoveInfo();
    for (let i = 0; i < arr.length; i++) {
        fs.writeFileSync(`../temp/move/${arr[i].id + ' ' + arr[i].name}.txt`, arr[i].parsed, {flag: "w+"});
    }
}

test();