const fs = require("fs");
const {getPokeBasicInfo} = require("../src/details/getPokeBasicInfo.js");
const {log} = require("../src/basicConfig.js");


try {
    (async function () {
        let arr = await getPokeBasicInfo();
        fs.writeFileSync("../temp/getPokeBasicInfo.test.json",
            JSON.stringify(arr, null, 4), {flag: "w+"});
    })();
} catch (err) {
    log(err.message, "error");
}