const fs = require("fs");
const {getSkillBasicInfo} = require("../src/details/getSkillBasicInfo.js");

async function test() {
    let arr = await getSkillBasicInfo();
    fs.writeFileSync("../temp/getSkillBasicInfo.test.json", JSON.stringify(arr, null, 4), {flag: "w+"});
}

test();