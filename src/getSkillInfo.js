const {getSkillBasicInfo, SkillBasicInfo} = require("./details/getSkillBasicInfo.js");
const {getMediaWikiSourceCode} = require("./basicConfig");
require("cejs");

class SkillInfo extends SkillBasicInfo {
    effect = null;        /*招式附加效果*/
    history = null;       /*招式变更*/
    maxPP = null;         /*最大PP*/
    range = null;         /*招式范围*/
    priority = null;      /*优先度*/

}

async function getSkillInfo() {
    let skillBasicInfo = await getSkillBasicInfo();
    let skillInfoArray = [];

    let workArray = [];

    CeL.run(['application.net.wiki']);

    for (let elem of skillBasicInfo) {
        if (!elem.url) {
            continue;
        }

        workArray.push(getMediaWikiSourceCode(elem.url)
            .then(code => CeL.wiki.parse(code))
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

module.exports = {SkillInfo, getSkillInfo};