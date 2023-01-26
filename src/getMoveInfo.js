const {getMoveBasicInfo} = require("./details/getMoveBasicInfo.js");
const {getMediaWikiSourceCode} = require("./basicConfig");
const WikiTemplateParser = require("./tools/WikiTemplateParser.js");


async function getMoveInfo() {
    let skillBasicInfo = await getMoveBasicInfo();
    let skillInfoArray = [];

    let workArray = [];

    for (let elem of skillBasicInfo) {
        if (!elem.url) {
            continue;
        }

        workArray.push(getMediaWikiSourceCode(elem.url)
            //.then(code => WikiTemplateParser.getTemplate(code, '招式信息框'))
            // .then(code => {
            //     return WikiTemplateParser.parse(code)
            // })
            .then(parsed => {
                skillInfoArray.push({
                    name: elem.name,
                    id: elem.id,
                    parsed: parsed
                });
            })
        );
    }
    await Promise.all(workArray);

    // //按id排序 id是NaN的放在最后
    // skillInfoArray.sort((a, b) => {
    //     if (isNaN(a.id) && isNaN(b.id)) {
    //         return 0;
    //     } else if (isNaN(a.id)) {
    //         return 1;
    //     } else if (isNaN(b.id)) {
    //         return -1;
    //     } else {
    //         return a.id - b.id;
    //     }
    // });

    return skillInfoArray;
}

module.exports = {getMoveInfo};