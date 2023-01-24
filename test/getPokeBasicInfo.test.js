const fs = require("fs");
const {getPokeBasicInfo} = require("../src/details/getPokeBasicInfo.js");

async function test() {
    let arr = await getPokeBasicInfo();
    fs.writeFileSync("../temp/getPokeBasicInfo.test.json",
        JSON.stringify(arr, null, 4), {flag: "w+"});
}

test();