const fs = require("fs");
const {getSkillBasicInfo} = require("../src/details/getSkillBasicInfo.js");
const {log} = require("../src/basicConfig.js");

try {
    (async function () {
        let arr = await getSkillBasicInfo();
        fs.writeFileSync("../temp/getSkillBasicInfo.test.json", JSON.stringify(arr, null, 4), {flag: "w+"});
    })();
} catch (err) {
    log(err.message, "error");
}