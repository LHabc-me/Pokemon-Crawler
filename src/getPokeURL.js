import axios from "axios";
import cheerio from "cheerio";

const url = new URL("https://wiki.52poke.com/wiki/宝可梦列表（按全国图鉴编号）/简单版");
const urlHead = "https://wiki.52poke.com";


class PokeURL {

    setInfo(lang, name, url) {
        this[`${lang}`] = {
            "name": `${name}`,
            "url": `${url}`,
        }
    }

    getInfo(lang) {
        return this[`${lang}`];
    }
}

export default function getPokeURL() {
    const pokeURLArray = [];

    return axios.get(url.toString())
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

            td.map((index, elem) => {
                let tds = $(elem).find("td");
                //let num = $(tds[0]).text().replace(/[#\s]/g, "");

                let zhName = $(tds[1]).text().trim();
                let zhLink = urlHead + $(tds[1]).find("a").attr("href").trim();
                let enName = $(tds[2]).text().trim();
                let enLink = urlHead + $(tds[2]).find("a").attr("href").trim();
                let jpName = $(tds[3]).text().trim();
                let jpLink = urlHead + $(tds[3]).find("a").attr("href").trim();

                let poke = new PokeURL();
                poke.setInfo("zh", zhName, zhLink);
                poke.setInfo("en", enName, enLink);
                poke.setInfo("jp", jpName, jpLink);
                pokeURLArray.push(poke);
            })
        })
        .then(() => JSON.stringify(pokeURLArray, null, 4));
}
