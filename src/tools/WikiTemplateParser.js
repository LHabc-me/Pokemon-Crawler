"use strict";

const assert = require("assert");

class WikiTemplateParser {
    /*
        例：
        {{Movelistheader|等级||一般|k=v|k2={{}}}}
        返回：{
            name: 'Movelistheader',
            params: [
                {"key"=null, "value"='等级'},
                {"key"=null, "value"=''},
                {"key"=null, "value"='一般'},
                {"key"='k', "value"='v'},
                {"key"='k2', "value"='{{}}'}
            ]
        }
     */
    static parse(templateSourceCode) {
        let code = templateSourceCode.trim().substring(2, templateSourceCode.length - 2);
        //按|分割，里层{{}}内的|不分割
        let params = [];
        let start = 0;
        let end = 0;
        let level = 0;
        for (let i = 0; i < code.length - 1; i++) {
            if (code[i] === '{' && code[i + 1] === '{') {
                level++;
                i++;
            } else if (code[i] === '}' && code[i + 1] === '}') {
                level--;
                i++;
            } else if (code[i] === '|' && level === 0) {
                params.push(code.substring(start, i).trim());
                start = i + 1;
            }
        }
        params.push(code.substring(start).trim());
        let name = params[0];
        params = params.slice(1).map(param => {
            let index = param.indexOf('=');
            return {
                key: index === -1 ? null : param.substring(0, index).trim(),
                value: index === -1 ? param : param.substring(index + 1).trim()
            }
        });
        return {name, params};
    }

    static isTemplate(templateSourceCode) {
        let code = templateSourceCode.trim();
        return code.startsWith('{{') && code.endsWith('}}');
    }


    static getTemplate(mediaWikiSourcecode, templateName) {
        /*
            例:getTemplate(s, '招式信息框')
                s='{{译名切换}}
                {{招式信息框
                |n=869
                |name=仆刀
                |game={{招式信息框/game|type=恶|gen=9|SV=y}}
                }}

                ==招式附加效果==
                攻击目标造成伤害。

                {{招式效果/必中}}'

            返回:{{招式信息框
                |n=869
                |name=仆刀
                |game={{招式信息框/game|type=恶|gen=9|SV=y}}
                }}
        */
        let code = mediaWikiSourcecode;
        let start = code.indexOf(`{{${templateName}|`);
        if (start === -1) {
            return "";
        }

        let end = start;
        let left = 0;
        let right = 0;
        while (end < code.length) {
            if (code[end] === '{') {
                left++;
            } else if (code[end] === '}') {
                right++;
            }
            if (left === right && left !== 0) {
                end++;
                break;
            }
            end++;
        }
        return code.slice(start, end);
    }
}

module.exports = WikiTemplateParser;

// let s = `{{招式信息框
// |n=656
// |name=可愛星星飛天撞
// |jname=ラブリースターインパクト
// |enname=Twinkle Tackle
// |gameimage=可愛星星飛天撞.png
// |type=妖精
// |damagecategory=Z
// |basepp=1
// |maxpp=1
// |power=—
// |accuracy=—
// |gen=7
// |touches=no
// |protect=no
// |magiccoat=no
// |snatch=no
// |mirrormove=no
// |kingsrock=no
// |target=2
// |game={{招式信息框/game|type=妖精|gen=7}}
// |footnotes=
// }}
//
// ==招式附加效果==
// 可愛星星飛天撞會造成傷害。
// * {{招式效果/必中}}
// *若攻击的对象使用了{{m|守住}}等{{DL|防住类招式|防住类招式}}，攻击也能成功但伤害减少到原来的{{frac|1|4}}。
//
// ==可以学会该招式的宝可梦==
// {{招式/泛用Ｚ招式|妖精}}
//
// ==名字==
// {{名字/header|妖精}}
// {{名字/entry|ja|ラブリースターインパクト|roma=Lovely Star Impact}}
// {{名字/entry|zh_nin|可愛星星飛天撞|simp=可爱星星飞天撞}}
// {{名字/entry|en|Twinkle Tackle}}
// {{名字/entry|fr|Impact Choupinova}}
// {{名字/entry|de|Entzückender Sternenstoß}}
// {{名字/entry|it|Astroimpatto Fatato}}
// {{名字/entry|es|Arrumaco Sideral}}
// {{名字/entry|ko|러블리스타임팩트|roma=Lovely Star Impact|end=yes}}
//
// {{招式/Ｚ招式|妖精}}
// {{神奇寶貝百科招式工程}}
//
// [[de:Entzückender Sternenstoß]]
// [[en:Twinkle Tackle (move)]]
// [[es:Arrumaco sideral]]
// [[fr:Impact Choupinova]]
// [[it:Astroimpatto Fatato]]
// [[ja:ラブリースターインパクト]]
// `
//
// let t = WikiTemplateParser.getTemplate(s, '招式信息框');
// console.log(t);
// let p = WikiTemplateParser.parse(t);
// console.log(p);