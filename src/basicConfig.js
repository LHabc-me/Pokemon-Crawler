import axios from "axios";

export class DataSource {
    static pokeMainURL = "https://wiki.52poke.com/wiki/宝可梦列表（按全国图鉴编号）/简单版";
    static skillMainURL = "https://wiki.52poke.com/wiki/招式列表";
    static URLHead = "https://wiki.52poke.com";
}

export function log(message, level = "info") {
    if (level === "info") {
        console.log(message);
    } else {
        console.error(message);
    }
}

export function getPageByURL(url) {
    return axios.get(url);
}