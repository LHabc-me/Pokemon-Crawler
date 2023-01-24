const axios = require("axios");
const cheerio = require("cheerio");
const PageGetter = require("./tools/PageGetter.js");
const pandoc = require('node-pandoc');

class DataSource {
    static pokeMainURL = new URL("https://wiki.52poke.com/wiki/宝可梦列表（按全国图鉴编号）/简单版").toString();
    static skillMainURL = new URL("https://wiki.52poke.com/wiki/招式列表").toString();
    static itemMainURL = new URL("https://wiki.52poke.com/wiki/道具列表").toString();
    static URLHead = new URL("https://wiki.52poke.com").toString();
}

function log(message, level = "info") {
    if (level === "info") {
        console.log(message);
    } else {
        console.error(message);
    }
}


//休眠n ms，不占用cpu资源
function sleep(n) {
    return new Promise(resolve => setTimeout(resolve, n));
}

async function getPage(url) {
    console.log(url);
    if (PageGetter.cache_root !== '../cache') {
        PageGetter.cache_root = '../cache';
    }
    return PageGetter.get(url).then(page => page.body);
}

//获取界面的MediaWiki代码
function getMediaWikiSourceCode(url) {
    /*
      格式：
        <a href="/index.php?title=%E8%BF%9E%E7%BB%AD%E6%8B%B3%EF%BC%88%E6%8B%9B%E5%BC%8F%EF%BC%89&amp;action=edit">
            <span>查看源代码</span>
        </a>
      处理为：URLHead + "/index.php?title=%E8%BF%9E%E7%BB%AD%E6%8B%B3%EF%BC%88%E6%8B%9B%E5%BC%8F%EF%BC%89&amp;action=edit"
      然后从中获取MediaWiki代码
    */
    //let sourceCodeURL = url.replace("/wiki/", "/index.php?title=") + "&action=edit";
    return getPage(url)
        .then((htmlPage) => {
            let $ = cheerio.load(htmlPage);
            return DataSource.URLHead + $("span:contains('查看源代码')").parent().attr("href").trim();
        })
        .then((sourceCodeURL) => getPage(sourceCodeURL))
        .then((htmlPage) => {
            let $ = cheerio.load(htmlPage);
            return $("textarea").text().trim();
        });
}

module.exports = {DataSource, log, getPage, sleep, getMediaWikiSourceCode};