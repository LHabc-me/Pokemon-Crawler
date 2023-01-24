const cheerio = require("cheerio");
const {DataSource, getPage} = require("../basicConfig");

class ItemBasicInfo {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }

    name = null;    /*中文名称*/
    url = null;     /*道具详情页URL*/
}

function getItemBasicInfo() {
    /*
        结构:
            <tbody>
                <tr>
                    ...
                </tr>
                <tr>
                    <td>
                        <a href="/wiki/%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE%EF%BC%88%E9%81%93%E5%85%B7%EF%BC%89" title="除虫喷雾">
                            <img alt="除虫喷雾" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" decoding="async" width="30" height="30" data-url="//media.52poke.com/wiki/thumb/e/ef/Bag_%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE_SV_Sprite.png/30px-Bag_%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE_SV_Sprite.png" data-srcset="//media.52poke.com/wiki/thumb/e/ef/Bag_%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE_SV_Sprite.png/45px-Bag_%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE_SV_Sprite.png 1.5x, //media.52poke.com/wiki/thumb/e/ef/Bag_%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE_SV_Sprite.png/60px-Bag_%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE_SV_Sprite.png 2x" />
                        </a>
                    </td>
                    <td>
                        <a href="/wiki/%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE%EF%BC%88%E9%81%93%E5%85%B7%EF%BC%89" title="除虫喷雾（道具）">除虫喷雾</a>
                    </td>
                    <td>むしよけスプレー
                    </td>
                    <td>Repel
                    </td>
                    <td>使用后，在较短的一段时间内，弱小的野生宝可梦将完全不会出现。
                    </td>
                </tr>
                <tr>
                    ...
                </tr>
            </tbody>

        处理为: {
            name: "除虫喷雾",
            url: "https://wiki.52poke.com/wiki/%E9%99%A4%E8%99%AB%E5%96%B7%E9%9B%BE%EF%BC%88%E9%81%93%E5%85%B7%EF%BC%89"
        }
     */

    const itemBasicInfoArray = [];

    const url = DataSource.itemMainURL;
    const urlHead = DataSource.URLHead;

    return getPage(url)
        .then(htmlPage => {
            let $ = cheerio.load(htmlPage);
            let tbody = $("tbody");
            let trs = tbody.children("tr");

            trs.each((index, element) => {
                    let tds = $(element).children("td");
                    if (tds.length !== 5) {
                        return;
                    }

                    let a = tds.eq(1).children("a");
                    let name = a.text().trim();
                    if (name.length === 0) {
                        return;
                    }
                    
                    let url = urlHead + a.attr("href").trim();

                    itemBasicInfoArray.push(new ItemBasicInfo(name, url));
                }
            );
            return itemBasicInfoArray;
        })
}

module.exports = {ItemBasicInfo, getItemBasicInfo};