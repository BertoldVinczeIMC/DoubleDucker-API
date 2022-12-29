"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.getToken = exports.decodeToken = exports.verifyToken = exports.createToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ user }, process.env.SECRET, { expiresIn: "24h" });
};
exports.createToken = createToken;
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeToken = decodeToken;
const getToken = (req) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.split(" ")[1];
        return token;
    }
    return null;
};
exports.getToken = getToken;
const checkToken = (req, res, next) => {
    const token = (0, exports.getToken)(req);
    if (token) {
        try {
            const user = (0, exports.verifyToken)(token, process.env.SECRET);
            req.user = user;
        }
        catch (err) {
            res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: null,
            });
        }
    }
    else {
        res.status(401).json({
            status: 401,
            message: "Unauthorized",
            data: null,
        });
    }
    next();
};
exports.checkToken = checkToken;
//# sourceMappingURL=token.js.map