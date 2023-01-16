import getPokeURL from "./details/getPokeURL.js";
import axios from "axios";
import fs from "fs";

function getPokeData() {
    return axios.get("https://wiki.52poke.com/wiki/%E5%AF%86%E5%8B%92%E9%A1%BF")
        .then(htmlPage => htmlPage.data);

}

(async function () {
    fs.writeFileSync("../temp/temp.html", await getPokeData(), {flag: "w+"});
})();