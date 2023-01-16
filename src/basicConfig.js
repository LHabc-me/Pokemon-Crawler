export class DataSource {
    static pokeMainURL = new URL("https://wiki.52poke.com/wiki/宝可梦列表（按全国图鉴编号）/简单版").toString();
    static skillMainURL = new URL("https://wiki.52poke.com/wiki/招式列表").toString();
    static URLHead = new URL("https://wiki.52poke.com").toString();
}

export function log(message, level = "info") {
    if (level === "info") {
        console.log(message);
    } else {
        console.error(message);
    }
}