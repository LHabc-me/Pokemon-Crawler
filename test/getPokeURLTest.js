import getPokeURL from "../src/details/getPokeURL.js";
import fs from "fs";

(async function () {
    let arr = await getPokeURL();
    fs.writeFileSync("../temp/getPokeURL.json", JSON.stringify(arr[1008], null, 4), {flag: "w+"});
})();