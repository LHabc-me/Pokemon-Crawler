import getPokeURL from "../src/getPokeURL.js";
import fs from "fs";

(async function () {
    let urls = await getPokeURL();
    fs.writeFileSync("../temp/getPokeURL.json", urls.toString(), {flag: "w+"});
})();