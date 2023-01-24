const fs = require("fs");
const {getItemInfo} = require("../src/getItemInfo.js");

async function test() {
    let arr = await getItemInfo();
    for (let i = 0; i < arr.length; i++) {
        fs.writeFileSync(`../temp/item/${arr[i].name}.txt`, arr[i].parsed, {flag: "w+"});
    }
}

test();