const fs = require("fs");
const {getSkillBasicInfo} = require("../src/details/getMoveBasicInfo.js");

async function test() {
    let arr = await getSkillBasicInfo();
    fs.writeFileSync("../temp/getSkillBasicInfo.test.json", JSON.stringify(arr, null, 4), {flag: "w+"});
}

test();