const {getMediaWikiSourceCode} = require("../src/basicConfig.js");
const fs = require("fs");
const {log} = require("../src/basicConfig.js");

try {
    (async function () {
        let code = await getMediaWikiSourceCode("https://wiki.52poke.com//wiki/%E7%A9%BA%E6%89%8B%E5%8A%88%EF%BC%88%E6%8B%9B%E5%BC%8F%EF%BC%89");
        fs.writeFileSync("../temp/basicConfig.test.json", JSON.stringify(code, null, 4), {flag: "w+"});
    })();
} catch (err) {
    log(err.message, "error");
}