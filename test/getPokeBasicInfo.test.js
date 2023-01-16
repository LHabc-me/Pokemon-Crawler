import fs from "fs";
import {getPokeBasicInfo} from "../src/details/getPokeBasicInfo.js";
import {log} from "../src/basicConfig.js";

try {
    (async function () {
        let arr = await getPokeBasicInfo();
        fs.writeFileSync("../temp/getPokeBasicInfo.test.json",
            JSON.stringify(arr, null, 4), {flag: "w+"});
    })();
} catch (err) {
    log(err, "error");
}