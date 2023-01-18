import cheerio from "cheerio";
import {getSkillBasicInfo, SkillBasicInfo} from "./details/getSkillBasicInfo.js";
import {getPageByURL} from "./basicConfig.js";

class SkillInfo extends SkillBasicInfo {
    effect = null;        /*招式附加效果*/
    history = null;       /*招式变更*/
}

export async function getSkillInfo() {
    let skillBasicInfo = await getSkillBasicInfo();
    let skillInfoArray = [];

    let workArray = [];

    for (let elem of skillBasicInfo) {
        /*
          结构：
            <h2>
                <span id=".E6.8B.9B.E5.BC.8F.E9.99.84.E5.8A.A0.E6.95.88.E6.9E.9C"></span>
                <span class="mw-headline" id="招式附加效果">招式附加效果</span>
            </h2>
            <p>自我再生恢复使用者<sup>1</sup>&#8260;<sub>2</sub>的<a href="/wiki/%EF%BC%A8%EF%BC%B0" title="ＨＰ">ＨＰ</a>。
            </p>
            <p>在使用者处于<a href="/wiki/%E5%9B%9E%E5%A4%8D%E5%B0%81%E9%94%81%EF%BC%88%E7%8A%B6%E6%80%81%EF%BC%89" title="回复封锁（状态）">回复封锁</a>状态时无法使用。
            </p>
            <h2>
                <span id=".E6.8B.9B.E5.BC.8F.E8.AF.B4.E6.98.8E"></span>
                <span class="mw-headline" id="招式说明">招式说明</span>
            </h2>
            <h2>
                <span id=".E6.8B.9B.E5.BC.8F.E5.8F.98.E6.9B.B4"></span>
                <span class="mw-headline" id="招式变更">招式变更</span>
            </h2>
            <h3>
                <span id=".E7.AC.AC.E5.9B.9B.E4.B8.96.E4.BB.A3"></span>
                <span class="mw-headline" id="第四世代">第四世代</span>
            </h3>
            <ul>
                <li>ＰＰ：<b>20</b> → <b>10</b>
                </li>
                <li>增加效果：<b>在使用者处于<a href="/w......

         处理为：{
            effect: "自我再生恢复使用者{1/2}的ＨＰ。在使用者处于{回复封锁}状态时无法使用。",
            history: "第四世代：ＰＰ：20 → 10 增加效果：在使用者处于{回复封锁}状态时无法使用。"
        }//保留富文本
        */

        if (!elem.url) {
            continue;
        }

        workArray.push(
            getPageByURL(elem.url).then((htmlPage) => {
                let $ = cheerio.load(htmlPage.data);

                let skillInfo = new SkillInfo();
                Object.assign(skillInfo, elem);
                skillInfo.effect = $("h2:contains('招式附加效果')").nextUntil("h2").toString();
                //提取p标签的内容，a标签的内容用{}括起来，其他的忽略
                skillInfo.effect = skillInfo.effect.replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<a.*?>(.*?)<\/a>/g, "{$1}").replace(/<.*?>/g, "").trim();

                skillInfo.history = $("h2:contains('招式变更')").nextUntil("h2").toString();
                //a标签的内容用{}括起来，去除标签保留内容
                skillInfo.history = skillInfo.history.replace(/<a.*?>(.*?)<\/a>/g, "{$1}").replace(/<.*?>/g, "").trim();

                skillInfoArray.push(skillInfo);
            }));
    }
    await Promise.all(workArray);

    //按id排序 id是NaN的放在最后
    skillInfoArray.sort((a, b) => {
        if (isNaN(a.id) && isNaN(b.id)) {
            return 0;
        } else if (isNaN(a.id)) {
            return 1;
        } else if (isNaN(b.id)) {
            return -1;
        } else {
            return a.id - b.id;
        }
    });

    return skillInfoArray;
}
