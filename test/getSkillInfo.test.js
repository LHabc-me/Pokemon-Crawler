const fs = require("fs");
const {getSkillInfo} = require("../src/getSkillInfo.js");

async function test() {
    let arr = await getSkillInfo();
    for (let i = 0; i < arr.length; i++) {
        fs.writeFileSync(`../temp/skill/${arr[i].id + ' ' + arr[i].name}.txt`, arr[i].parsed, {flag: "w+"});
    }
}

test();