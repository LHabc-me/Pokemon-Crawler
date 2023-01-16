import {getPokeBasicInfo, PokeBasicInfo} from "./details/getPokeBasicInfo.js";
import axios from "axios";
import fs from "fs";

function getPokeInfo() {
    return axios.get("https://wiki.52poke.com/wiki/%E5%AF%86%E5%8B%92%E9%A1%BF")
        .then(htmlPage => htmlPage.data);

}

class PokeInfo extends PokeBasicInfo {
    skills = [];    /*技能列表*/
    types = [];     /*属性列表*/
}

(async function () {
    fs.writeFileSync("../temp/temp.html", await getPokeInfo(), {flag: "w+"});
})();