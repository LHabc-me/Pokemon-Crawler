"use strict";

/*基于Promise封装fs*/
const fs = require('fs');
const util = require('util');

class FS {
    static readFile = util.promisify(fs.readFile);
    static writeFile = util.promisify(fs.writeFile);
    static readdir = util.promisify(fs.readdir);
    static stat = util.promisify(fs.stat);
    static mkdir = util.promisify(fs.mkdir);
    static rmdir = util.promisify(fs.rmdir);
    static unlink = util.promisify(fs.unlink);
    static rename = util.promisify(fs.rename);
    static copyFile = util.promisify(fs.copyFile);
    static exists = util.promisify(fs.exists);
    static access = util.promisify(fs.access);
    static lstat = util.promisify(fs.lstat);
    static symlink = util.promisify(fs.symlink);
    static readlink = util.promisify(fs.readlink);
    static realpath = util.promisify(fs.realpath);
    static chmod = util.promisify(fs.chmod);
    static lchmod = util.promisify(fs.lchmod);
    static lchown = util.promisify(fs.lchown);
    static chown = util.promisify(fs.chown);
    static utimes = util.promisify(fs.utimes);
    static lutimes = util.promisify(fs.lutimes);
    static link = util.promisify(fs.link);
    static appendFile = util.promisify(fs.appendFile);
    static truncate = util.promisify(fs.truncate);
    static ftruncate = util.promisify(fs.ftruncate);
    static open = util.promisify(fs.open);
    static close = util.promisify(fs.close);
    static read = util.promisify(fs.read);
    static write = util.promisify(fs.write);

    static readSync = fs.readFileSync;
    static writeSync = fs.writeFileSync;
    static readdirSync = fs.readdirSync;
    static statSync = fs.statSync;
    static mkdirSync = fs.mkdirSync;
    static rmdirSync = fs.rmdirSync;
    static unlinkSync = fs.unlinkSync;
    static renameSync = fs.renameSync;
    static copyFileSync = fs.copyFileSync;
    static existsSync = fs.existsSync;
    static accessSync = fs.accessSync;
    static lstatSync = fs.lstatSync;
    static symlinkSync = fs.symlinkSync;
    static readlinkSync = fs.readlinkSync;
    static realpathSync = fs.realpathSync;
    static chmodSync = fs.chmodSync;
    static lchmodSync = fs.lchmodSync;
    static lchownSync = fs.lchownSync;
    static chownSync = fs.chownSync;
    static utimesSync = fs.utimesSync;
    static lutimesSync = fs.lutimesSync;
    static linkSync = fs.linkSync;
    static appendFileSync = fs.appendFileSync;
    static truncateSync = fs.truncateSync;
    static ftruncateSync = fs.ftruncateSync;
    static openSync = fs.openSync;
    static closeSync = fs.closeSync;
}

module.exports = FS;