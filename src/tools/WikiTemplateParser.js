"use strict";

const assert = require("assert");

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

module.exports = WikiTemplateParser;

// console.log(WikiTemplateParser.parse(s));