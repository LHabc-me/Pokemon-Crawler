import fs from "fs";
import {getSkillInfo} from "../src/getSkillInfo.js";
import {log} from "../src/basicConfig.js";

try {
    (async function () {
        let arr = await getSkillInfo();
        fs.writeFileSync("../temp/getSkillInfo.test.json", JSON.stringify(arr, null, 4), {flag: "w+"});
    })();
} catch (err) {
    log(err, "error");
}