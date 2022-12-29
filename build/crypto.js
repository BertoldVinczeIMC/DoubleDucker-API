"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createuuid = exports.shortenUrl = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("./logger");
function shortenUrl(url) {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(4, (err, buffer) => {
            if (err) {
                (0, logger_1.logError)(`Error while creating short url: ${err.message}`);
                reject(err.message);
            }
            else {
                let ret = buffer.toString('hex');
                (0, logger_1.logInfo)(`Created short url: ${ret} | original url: ${url}`);
                resolve(ret);
            }
        });
    });
}
exports.shortenUrl = shortenUrl;
function createuuid() {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(16, (err, buffer) => {
            if (err) {
                (0, logger_1.logError)(`Error while creating uuid: ${err.message}`);
                reject(err.message);
            }
            else {
                let ret = buffer.toString('hex');
                (0, logger_1.logInfo)(`Created uuid: ${ret}`);
                resolve(ret);
            }
        });
    });
}
exports.createuuid = createuuid;
//# sourceMappingURL=crypto.js.map