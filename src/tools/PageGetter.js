"use strict";

const Crawler = require('crawler');
const fs = require('FS');
const util = require('util');
const path = require('path');

//基于Promise和缓存简化Crawler
class PageGetter {
    static cache_root = './cache';

    static getCrawler() {
        return this._crawler;
    }

    static setInterval(time_ms) {
        if (time_ms <= 0) {
            this._crawler.options.rateLimit = 0;
        } else {
            this._crawler.options.rateLimit = time_ms;
        }
    }

    //获取url内容
    static get(url, via_net = true, cache = true) {
        if (via_net || !fs.existsSync(this._getFileName(url))) {
            return this._getViaNet(url, cache);
        } else {
            return this._getViaCache(url);
        }
    }

    static _crawler = new Crawler();

    //从网络获取并缓存
    static _getViaNet(url, cahce = true) {
        return new Promise((resolve, reject) => {
            this._crawler.queue({
                uri: url,
                callback: (error, res, done) => {
                    if (error) {
                        reject(error);
                    } else if (cahce) {
                        this._cache(url, res).then(() => resolve(res));
                    } else {
                        resolve(res);
                    }
                    done();
                }
            });
        });
    }

    //从缓存获取
    static _getViaCache(url) {
        console.log(this._getFileName(url))
        return this._readFile(this._getFileName(url), {encoding: 'utf8'})
            .then(content => JSON.parse(content));

    }

    //缓存
    static _cache(url, content) {
        let file_name = this._getFileName(url);

        //递归创建文件夹
        let dir_name = path.dirname(file_name);
        if (!fs.existsSync(dir_name)) {
            fs.mkdirSync(dir_name, {
                recursive: true
            });
        }

        //写入文件
        return this._writeFile(file_name, JSON.stringify(content, null, 4), {encoding: 'utf8', flag: 'w+'});
    }

    //获取缓存文件名(相对路径)
    static _getFileName(url) {
        /*
          将url处理为文件名
          例：https://www.baidu.com/first/second.html
                =>
              {cache_root}/www.baidu.com/first/second.html.cache
            //前的所有字符都会被忽略 文件夹不存在则递归创建
        */
        let file_name = url.replace(/.*:\/\//, '');
        if (file_name.endsWith('/')) {
            file_name = file_name.slice(0, -1);
        }
        file_name = path.join(this.cache_root, file_name + '.cache');

        return file_name;
    }

    static _readFile = util.promisify(fs.readFile);
    static _writeFile = util.promisify(fs.writeFile);
}

module.exports = PageGetter;