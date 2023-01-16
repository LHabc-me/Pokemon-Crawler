const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");

function saveInTemp(data) {
    fs.writeFileSync("../data/temp.txt", data.toString(), {flag: "w+"});
}

let url = new URL("https://wiki.52poke.com/wiki/宝可梦列表（按全国图鉴编号）/简单版");
let urlHead = "https://wiki.52poke.com";

axios.get(url.toString())
    .then(res => {
        let $ = cheerio.load(res.data.toString());

        let td = $("tr:has(td:contains('#'))");

        /*
         结构:
          <tr>
            <td>#137</td>
            <td><a href="/wiki/%E5%A4%9A%E8%BE%B9%E5%85%BD" title="多边兽">多边兽</a></td>
            <td><a href="/wiki/%E3%83%9D%E3%83%AA%E3%82%B4%E3%83%B3" class="mw-redirect" title="ポリゴン">ポリゴン</a></td>
            <td><a href="/wiki/Porygon" class="mw-redirect" title="Porygon">Porygon</a></td>
          </tr>

          处理为:
          137
          多边兽 https://wiki.52poke.com/wiki/%E5%A4%9A%E8%BE%B9%E5%85%BD
          ポリゴン https://wiki.52poke.com/wiki/%E3%83%9D%E3%83%AA%E3%82%B4%E3%83%B3
          Porygon https://wiki.52poke.com/wiki/Porygon"
        */

        let data = td.map((i, e) => {
            let tds = $(e).find("td");
            let num = $(tds[0]).text().replace(/[#\s]/g, "");
            let name = $(tds[1]).text().trim();
            let nameLink = urlHead + $(tds[1]).find("a").attr("href").trim();
            let nameEn = $(tds[2]).text().trim();
            let nameEnLink = urlHead + $(tds[2]).find("a").attr("href").trim();
            let nameJp = $(tds[3]).text().trim();
            let nameJpLink = urlHead + $(tds[3]).find("a").attr("href").trim();
            return (
                `${num}\n${name} ${nameLink}\n${nameEn} ${nameEnLink}\n${nameJp} ${nameJpLink}\n\n`);
        }).get().join("");

        saveInTemp(data.trim());
    })
    .catch(err => console.log(`Error: ${err}`));
