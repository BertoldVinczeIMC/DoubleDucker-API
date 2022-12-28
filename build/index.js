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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const url_1 = require("./types/url");
const body_parser_1 = require("./validation/body_parser");
const crypto_1 = require("./crypto");
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
app.use(express_1.default.json());
const PORT = process.env.PORT;
function logMiddleware(req, res, next) {
    console.log(`${req.method} ${req.path}`);
    next();
}
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
app.post("/api/url", logMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const valid = yield (0, body_parser_1.validate)(req.body, url_1.UrlSchema);
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
}));
/**
 * @apiName Translate a short url to a long url
 * @api {get} /api/url/:id Translate a short url to a long url
 * @param {string} id is the short url
 * @response IRestDefaultResponse with status,message and data
 */
app.get("/api/url/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map