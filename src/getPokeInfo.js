const {getPokeBasicInfo} = require("./details/getPokeBasicInfo.js");
const {getMediaWikiSourceCode} = require("./basicConfig");
const WikiTemplateParser = require("./tools/WikiTemplateParser.js");

async function getPokeInfo() {
    let pokeBasicInfo = await getPokeBasicInfo();
    let pokeInfoArray = [];
    let workArray = [];

    for (let elem of pokeBasicInfo) {
        if (!elem.url) {
            continue;
        }

        workArray.push(getMediaWikiSourceCode(elem.url)
            //.then(code => WikiTemplateParser.getTemplate(code, '寶可夢信息框'))
            // .then(code => {
            //     return WikiTemplateParser.parse(code)
            // })
            .then(parsed => {
                pokeInfoArray.push({
                    name: elem.name,
                    id: elem.id,
                    parsed: parsed
                });
            })
        );
    }
    await Promise.all(workArray);
    return pokeInfoArray;
}

module.exports = {getPokeInfo};