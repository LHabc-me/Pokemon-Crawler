const cheerio = require("cheerio");
const {DataSource, getPage} = require("../basicConfig");

class SkillBasicInfo {
    generation = null;  /*第n世代出现*/
    id = null;          /*总技能编号*/
    name = null;        /*中文名称*/
    type = null;        /*属性*/
    category = null;    /*类别*/
    power = null;       /*威力*/
    accuracy = null;    /*命中率*/
    pp = null;          /*PP*/
    description = null; /*说明*/
    url = null;         /*技能详情页链接*/
}

function getMoveBasicInfo() {
    const SkillBasicInfoArray = [];

    const url = DataSource.skillMainURL;
    const urlHead = DataSource.URLHead;

    return getPage(url)
        .then(htmlPage => {
            let $ = cheerio.load(htmlPage);

            /*
                结构：
                <h2>
                    <span id=".E7.AC.AC.E4.B8.80.E4.B8.96.E4.BB.A3"></span>
                    <span class="mw-headline" id="第一世代">第一世代</span>
                </h2>
                <table>
                    <tbody>
                        <tr>
                            <td>1
                            </td>
                            <td>
                                <a href="/wiki/%E6%8B%8D%E5%87%BB%EF%BC%88%E6%8B%9B%E5%BC%8F%EF%BC%89" title="拍击（招式）">拍击</a>
                            </td>
                            <td lang="ja">はたく
                            </td>
                            <td>Pound
                            </td>
                            <td class="bg-一般 textwhite">一般
                            </td>
                            <td class="bg-物理 ts-物理">
                                <a href="/wiki/%E7%89%A9%E7%90%86%E6%8B%9B%E5%BC%8F" title="物理招式">物理</a>
                            </td>
                            <td>40
                            </td>
                            <td>100
                            </td>
                            <td>35
                            </td>
                            <td>使用长长的尾巴或手等拍打对手进行攻击。
                            </td>
                        </tr>
                     </table>
                </tbody>
                处理为：{
                    generation: "第一世代",
                    id: 1,
                    name: "拍击",
                    type: ["一般"],
                    category: "物理",
                    power: 40,
                    accuracy: 100,
                    pp: 35,
                    description: "使用长长的尾巴或手等拍打对手进行攻击。",
                    url: "https://wiki.52poke.com/wiki/%E6%8B%8D%E5%87%BB%EF%BC%88%E6%8B%9B%E5%BC%8F%EF%BC%89"
                }
            */
            let table = $("table");
            let tr = table.find("tr");
            tr.each((index, element) => {
                    let td = $(element).find("td");
                    if (td.length === 10) {
                        let skillBasicInfo = new SkillBasicInfo();
                        skillBasicInfo.generation = td.parent().parent().parent().prev().find("span").eq(1).text().trim();
                        skillBasicInfo.id = parseInt(td.eq(0).text());
                        skillBasicInfo.name = td.eq(1).text().trim();
                        skillBasicInfo.type = td.eq(4).text().trim();
                        skillBasicInfo.category = td.eq(5).text().trim();
                        skillBasicInfo.power = parseInt(td.eq(6).text());
                        skillBasicInfo.accuracy = parseInt(td.eq(7).text());
                        skillBasicInfo.pp = parseInt(td.eq(8).text());
                        skillBasicInfo.description = td.eq(9).text().trim();

                        //寻找最后一个a标签，获取href属性（因为z招式有z结晶的标签，不能找第一个）
                        skillBasicInfo.url = urlHead + td.eq(1).find("a").last().attr("href").trim();

                        SkillBasicInfoArray.push(skillBasicInfo);
                    }
                }
            );
            return SkillBasicInfoArray;
        });
}

module.exports = {SkillBasicInfo, getMoveBasicInfo};