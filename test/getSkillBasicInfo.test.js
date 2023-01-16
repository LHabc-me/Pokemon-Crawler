import {getSkillBasicInfo} from "../src/details/getSkillBasicInfo.js";
import fs from "fs";
import {log} from "../src/basicConfig.js";

try {
    (async function () {
        let arr = await getSkillBasicInfo();
        fs.writeFileSync("../temp/getSkillBasicInfo.test.json", JSON.stringify(arr, null, 4), {flag: "w+"});
    })();
} catch (err) {
    log(err, "error");
}