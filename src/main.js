const fs = require("fs");
const pandoc = require('node-pandoc');

let code = fs.readFileSync("../temp/temp.txt", "utf8");

let args = "-f mediawiki -t markdown";
pandoc(code, args, (err, result) => {
    fs.writeFileSync("../temp/temp.md", result, {flag: "w+"});
})