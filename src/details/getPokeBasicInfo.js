const cheerio = require("cheerio");
const {DataSource, getPage} = require("../basicConfig");

class PokeBasicInfo {
    constructor(id, name, url) {
        this.id = id;
        this.name = name;
        this.url = url;
    }

    id = null;      /*全国图鉴编号*/
    name = null;    /*中文名称*/
    url = null;     /*宝可梦详情页URL*/
}

/*
* 获取宝可梦基本数据(包括编号、名称和URL)，返回的数组下标为宝可梦的编号-1
* @returns: [PokeURL1, PokeURL2, ...]
* @example: getPokeBasicInfo().then(pokeURLs => console.log(pokeURLs[0].getInfo()));
 */
async function getPokeBasicInfo() {
    const pokeBasicInfoArray = [];

    const url = DataSource.pokeMainURL;
    const urlHead = DataSource.URLHead;

    return getPage(url)
        .then(htmlPage => {
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
              // ポリゴン https://wiki.52poke.com/wiki/%E3%83%9D%E3%83%AA%E3%82%B4%E3%83%B3
              // Porygon https://wiki.52poke.com/wiki/Porygon"
            */
            let $ = cheerio.load(htmlPage);
            let td = $("tr:has(td:contains('#'))");

            td.map((index, elem) => {
                let tds = $(elem).find("td");
                let id = Number.parseInt($(tds[0]).text().replace(/[#\s]/g, ""));

                let zhName = $(tds[1]).text().trim();
                let zhURL = urlHead + $(tds[1]).find("a").attr("href").trim();
                pokeBasicInfoArray[id - 1] = new PokeBasicInfo(id, zhName, zhURL);
            })
            return pokeBasicInfoArray;
        });
}


module.exports = {PokeBasicInfo, getPokeBasicInfo};