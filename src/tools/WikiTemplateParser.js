"use strict";

const assert = require("assert");
let s = `{{招式信息框
|n=1
|name=拍击
|jname=はたく
|enname=Pound
|type=一般
|damagecategory=物理
|basepp=35
|power=40
|accuracy=100
|gen=1
|touches=yes
|protect=yes
|magiccoat=no
|snatch=no
|mirrormove=yes
|kingsrock=yes
|target=2
|game={{招式信息框/game|type=一般|gen=1|LPLE=y|SWSH=y|BDSP=y|SV=y}}
|extra={{招式信息框/extra|type=一般|power=40|z=yes|max=yes}}
|contest={{招式信息框/contest|type=一般|appeal3=4|jam3=0|category=强壮|appeal4=3|appeal6=4|jam6=0|category6=强壮|appeal8=1}}
|footnotes=
}}
`

class WikiTemplateParser {
    /*
        例：
        {{Movelistheader|等级||一般|k=v}}
        返回：{
            name: 'Movelistheader',
            params: [
                {"key"=null, "value"='等级'},
                {"key"=null, "value"=''},
                {"key"=null, "value"='一般'},
                {"key"='k', "value"='v'},
            ]
        }
     */
    static parse(templateSourceCode) {
        assert(WikiTemplateParser.isTemplate(templateSourceCode));

        let content = templateSourceCode.slice(2, -2).trim().split('|');
        let name = content[0].trim();
        let params = content.slice(1).map(elem => {
            if (elem.includes("=")) {
                let [key, value] = elem.split('=');
                return {key: key.trim(), value: value.trim()};
            } else {
                return {key: null, value: elem.trim()};
            }
        });
        return {name, params};
    }

    static isTemplate(templateSourceCode) {
        return templateSourceCode.startsWith('{{') && templateSourceCode.endsWith('}}');
    }

}

// module.exports = WikiTemplateParser;

console.log(WikiTemplateParser.parse(s));