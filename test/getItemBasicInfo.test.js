const fs = require("fs");
const {getItemBasicInfo} = require("../src/details/getItemBasicInfo.js");

async function test() {
    let arr = await getItemBasicInfo();
    fs.writeFileSync("../temp/getItemBasicInfo.test.json",
        JSON.stringify(arr, null, 4), {flag: "w+"});
}

test();