const axios = require("axios");

class DataSource {
    static pokeMainURL = "https://wiki.52poke.com/wiki/宝可梦列表（按全国图鉴编号）/简单版";
    static skillMainURL = "https://wiki.52poke.com/wiki/招式列表";
    static URLHead = "https://wiki.52poke.com";
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

var i = 0;

async function getPageByURL(url) {
    console.log(i++);
    return axios.get(url);
}


module.exports = {DataSource, log, getPageByURL, sleep};