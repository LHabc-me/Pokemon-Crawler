const fs = require("fs");
const {getSkillInfo} = require("../src/getSkillInfo.js");
const {log} = require("../src/basicConfig.js");
try {
    (async function () {
        let arr = await getSkillInfo();
        fs.writeFileSync("../temp/getSkillInfo.test.json", JSON.stringify(arr, null, 4), {flag: "w+"});
    })();
} catch (err) {
    log(err.message, "error");
}