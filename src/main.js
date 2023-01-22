const fs = require("fs");
const pandoc = require('node-pandoc');
const {getMediaWikiSourceCode} = require("./basicConfig.js");

console.log
(getMediaWikiSourceCode(
    "https://wiki.52poke.com//wiki/%E5%A6%96%E7%B2%BE%EF%BC%BA%EF%BC%88%E9%81%93%E5%85%B7%EF%BC%89"));