"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarning = exports.logError = exports.logInfo = void 0;
const fs_1 = __importDefault(require("fs"));
function logInfo(message) {
    // now in DD/MM/YYYY HH:MM:SS format
    const date = new Date().toLocaleString("at-AT");
    // create prefix like [date] [info]
    const prefix = `[${date}] [info]: `;
    message = prefix + message;
    fs_1.default.appendFile("log.txt", message, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
exports.logInfo = logInfo;
function logError(message) {
    // now in DD/MM/YYYY HH:MM:SS format
    const date = new Date().toLocaleString("at-AT");
    // create prefix like [date] [info]
    const prefix = `[${date}] [error]: `;
    message = prefix + message;
    fs_1.default.appendFile("log.txt", message, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
exports.logError = logError;
function logWarning(message) {
    // now in DD/MM/YYYY HH:MM:SS format
    const date = new Date().toLocaleString("at-AT");
    // create prefix like [date] [info]
    const prefix = `[${date}] [warning]: `;
    message = prefix + message;
    fs_1.default.appendFile("log.txt", message, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
exports.logWarning = logWarning;
//# sourceMappingURL=logger.js.map