const {getItemBasicInfo} = require("./details/getItemBasicInfo.js");
const {getMediaWikiSourceCode} = require("./basicConfig");
const WikiTemplateParser = require("./tools/WikiTemplateParser.js");

async function getItemInfo() {
    let itemBasicInfo = await getItemBasicInfo();
    let itemInfoArray = [];
    let workArray = [];

    for (let elem of itemBasicInfo) {
        if (!elem.url) {
            continue;
        }

        workArray.push(getMediaWikiSourceCode(elem.url)
            .then(parsed => {
                itemInfoArray.push({
                    name: elem.name,
                    parsed: parsed
                });
            })
        );
    }
    await Promise.all(workArray);
    return itemInfoArray;
}

module.exports = {getItemInfo};