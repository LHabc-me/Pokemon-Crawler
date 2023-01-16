import getPokeBasicInfo from "../src/details/getPokeBasicInfo.js";
import fs from "fs";

(async function () {
    let arr = await getPokeBasicInfo();
    fs.writeFileSync("../temp/getPokeBasicInfo.test.json",
        JSON.stringify(arr, null, 4), {flag: "w+"});
})();