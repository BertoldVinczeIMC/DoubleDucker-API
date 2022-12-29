"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarning = exports.logError = exports.logInfo = exports.logMiddleware = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Logs every request to the server
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
function logMiddleware(req, res, next) {
    const message = `${req.method} ${req.path} ${req.ip}`;
    logInfo(message);
    next();
}
exports.logMiddleware = logMiddleware;
/**
 * Logs an info message to the log file
 * @param message string
 */
function logInfo(message) {
    // now in DD/MM/YYYY HH:MM:SS format
    const date = new Date().toLocaleString('at-AT');
    // create prefix like [date] [info]
    const prefix = `[${date}] [info]: `;
    message = prefix + message + '\n';
    fs_1.default.appendFile('log.txt', message, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
exports.logInfo = logInfo;
/**
 * Logs an error message to the log file
 *
 */
function logError(message) {
    // now in DD/MM/YYYY HH:MM:SS format
    const date = new Date().toLocaleString('at-AT');
    // create prefix like [date] [info]
    const prefix = `[${date}] [error]: `;
    message = prefix + message;
    fs_1.default.appendFile('log.txt', message, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
exports.logError = logError;
/**
 * Logs a warning message to the log file
 * @param message string
 */
function logWarning(message) {
    // now in DD/MM/YYYY HH:MM:SS format
    const date = new Date().toLocaleString('at-AT');
    // create prefix like [date] [info]
    const prefix = `[${date}] [warning]: `;
    message = prefix + message;
    fs_1.default.appendFile('log.txt', message, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
exports.logWarning = logWarning;
//# sourceMappingURL=logger.js.map