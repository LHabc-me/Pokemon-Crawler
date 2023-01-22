const fs = require("fs");
const {getSkillInfo} = require("../src/getSkillInfo.js");
const {log} = require("../src/basicConfig.js");
try {
    (async function () {
        let arr = await getSkillInfo();
        console.log(arr[1].parsed[0].type.getOwnPropertyDescriptor(""));
        for (let i = 0; i < arr.length; i++) {

            //fs.writeFileSync(`../temp/skill/${arr[i].id + ' ' + arr[i].name}.test.json`, JSON.stringify(arr[i].parsed, null, 4), {flag: "w+"});
        }
    })();
} catch (err) {
    log(err.message, "error");
}