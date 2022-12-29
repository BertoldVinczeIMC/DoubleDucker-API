"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* modules */
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/* Local modules */
const body_parser_1 = require("./validation/body_parser");
const crypto_1 = require("./crypto");
const logger_1 = require("./logger");
const body_1 = require("./schemas/body");
const crypto_2 = require("./crypto");
const token_1 = require("./auth/token");
/* App Setup */
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
dotenv_1.default.config();
const PORT = process.env.PORT;
/* Middlewares */
app.use(express_1.default.json());
app.use(logger_1.logMiddleware);
/* Routes */
/**
 * @apiName Default route
 */
app.get("/", (req, res) => {
    return res.status(404).json({
        status: 404,
        message: "Not Found",
    });
});
/**
 * @apiName Create a new short url
 * @api {post} /api/url Create a new short url
 * @body {JSON} body will be parsed and validated. Valid body is {url: string}
 * @response IRestDefaultResponse with status,message and data
 */
app.post("/api/url", token_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valid = yield (0, body_parser_1.validate)(req.body, body_1.UrlSchema);
        if (!valid)
            return res.status(422).json({
                status: 422,
                message: "Unprocessable Entity, Invalid Post Body",
                data: null,
            });
        const url = req.body;
        const existing = yield client.url.findFirst({
            select: {
                decoded: true,
                encoded: true,
                user_id: false,
            },
            where: {
                decoded: url.url,
            },
        });
        if (existing) {
            return res.status(200).json({
                status: 200,
                message: "Cannot create short url, this url already exists",
                data: existing,
            });
        }
        // generate uuid from crypto lib
        try {
            const shortUrl = yield (0, crypto_1.shortenUrl)(url.url);
            const newUrl = yield client.url.create({
                data: {
                    decoded: url.url,
                    encoded: shortUrl,
                    user_id: "muster",
                },
            });
            return res.status(200).json({
                status: 200,
                message: "OK",
                data: newUrl,
            });
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                data: null,
            });
        }
    }
    catch (err) {
        (0, logger_1.logError)(err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
        });
    }
}));
/**
 * @apiName Translate a short url to a long url
 * @api {get} /api/url/:id Translate a short url to a long url
 * @param {string} id is the short url
 * @response IRestDefaultResponse with status,message and data
 */
app.get("/api/url/:id", token_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const url = yield client.url.findFirst({
            select: {
                decoded: true,
                encoded: true,
                user_id: false,
            },
            where: {
                encoded: id,
            },
        });
        if (url) {
            return res.status(200).json({
                status: 200,
                message: "OK",
                data: url,
            });
        }
        else {
            return res.status(404).json({
                status: 404,
                message: "Not Found",
                data: null,
            });
        }
    }
    catch (err) {
        (0, logger_1.logError)(err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
        });
    }
}));
/**
 * @apiName Login
 * @api {post} /api/login Login
 * @body {JSON} body will be parsed and validated. Valid body is {username: string, password: string}
 * @response IRestDefaultResponse with status,message and token
 */
app.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valid = yield (0, body_parser_1.validate)(req.body, body_1.LoginUserSchema);
        if (!valid) {
            return res.status(422).json({
                status: 422,
                message: "Unprocessable Entity, Invalid Post Body",
                data: null,
            });
        }
        const user = req.body;
        const auth_user = yield client.auth.findFirst({
            where: {
                email: user.email,
            },
        });
        if (auth_user) {
            const match = yield bcrypt_1.default.compare(user.password, auth_user.password);
            if (match) {
                const token = (0, token_1.createToken)(auth_user.email);
                return res.status(200).json({
                    status: 200,
                    message: "OK",
                    data: token,
                });
            }
            else {
                return res.status(401).json({
                    status: 401,
                    message: "Unauthorized",
                    data: null,
                });
            }
        }
        else {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: null,
            });
        }
    }
    catch (err) {
        (0, logger_1.logError)(err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
        });
    }
}));
/**
 * @apiName Register
 * @api {post} /api/register Register
 * @body {JSON} body will be parsed and validated. Valid body is {username: string, password: string, email: string,secret: string}
 * @response IRestDefaultResponse with status,message and token
 */
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valid = yield (0, body_parser_1.validate)(req.body, body_1.RegisterUserSchema);
        if (!valid) {
            return res.status(422).json({
                status: 422,
                message: "Unprocessable Entity, Invalid Post Body",
                data: null,
            });
        }
        const user = req.body;
        // If secret is not correct, return 401
        if (user.secret !== process.env.SECRET) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: null,
            });
        }
        // Check if user already exists
        const existing = yield client.auth.findFirst({
            where: {
                email: user.email,
            },
        });
        if (existing) {
            return res.status(409).json({
                status: 409,
                message: "Conflict, User already exists",
                data: null,
            });
        }
        const uuid = yield (0, crypto_2.createuuid)();
        const hashedPassword = yield bcrypt_1.default.hash(user.password, 2);
        const newUser = yield client.auth.create({
            data: {
                user_id: uuid,
                email: user.email,
                password: hashedPassword,
            },
        });
        const token = yield (0, token_1.createToken)(newUser.user_id);
        return res.status(200).json({
            status: 200,
            message: "User created",
            data: token,
        });
    }
    catch (err) {
        (0, logger_1.logError)(err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
        });
    }
}));
/* Start Server */
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map