import axios from "axios";
import cheerio from "cheerio";
import {DataSource} from "../baseConfig.js";

const url = DataSource.pokeMainURL;
const urlHead = DataSource.URLHead;

class PokeURL {

    _setInfo(id, name, url) {
        this["id"] = id;
        this["name"] = name;
        this["url"] = url;
    }

    /*
    * 根据语言获取宝可梦的名字和URL
    * @returns: {id, name, url}
    * @example: poke.getInfo().name
    */
    getInfo() {
        return {
            "id": this.id,
            "name": this.name,
            "url": this.url
        }
    }
}

/*
* 获取宝可梦基本数据(包括编号、名称和URL)，返回的数组下标为宝可梦的编号
* @returns: [PokeURL1, PokeURL2, ...]
* @example: getPokeBasicInfo().then(pokeURLs => console.log(pokeURLs[0].getInfo()));
 */
export default function getPokeBasicInfo() {
    const pokeURLArray = [];

    return axios.get(url.toString())
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
            let $ = cheerio.load(htmlPage.data);
            let td = $("tr:has(td:contains('#'))");

            td.map((index, elem) => {
                let tds = $(elem).find("td");
                let id = Number.parseInt($(tds[0]).text().replace(/[#\s]/g, ""));

                let zhName = $(tds[1]).text().trim();
                let zhURL = urlHead + $(tds[1]).find("a").attr("href").trim();
                // let enName = $(tds[2]).text().trim();
                // let enURL = urlHead + $(tds[2]).find("a").attr("href").trim();
                // let jpName = $(tds[3]).text().trim();
                // let jpURL = urlHead + $(tds[3]).find("a").attr("href").trim();

                let poke = new PokeURL();
                poke._setInfo(id, zhName, zhURL);
                pokeURLArray[id] = poke;
            })
        })
        .then(() => pokeURLArray);
}
