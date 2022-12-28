/* modules */
import express, { Express, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

/* Local modules */
import { IRestDefaultResponse } from "./types/rest_response";
import { CreateUrlParser, UrlSchema } from "./types/url";
import { validate } from "./validation/body_parser";
import { shortenUrl } from "./crypto";
import { logMiddleware, logError } from "./logger";

/* App Setup */

const app: Express = express();

const client: PrismaClient = new PrismaClient();

dotenv.config();

const PORT = process.env.PORT;

/* Middlewares */

app.use(express.json());
app.use(logMiddleware);

/* Routes */

/**
 * @apiName Default route
 */
app.get("/", (req: Request, res: Response) => {
  return res.status(404).json({
    status: 404,
    message: "Not Found",
  } as IRestDefaultResponse);
});

/**
 * @apiName Create a new short url
 * @api {post} /api/url Create a new short url
 * @body {JSON} body will be parsed and validated. Valid body is {url: string}
 * @response IRestDefaultResponse with status,message and data
 */
app.post("/api/url", async (req: Request, res: Response) => {
  try {
    const valid = await validate(req.body, UrlSchema);
    if (!valid)
      return res.status(422).json({
        status: 422,
        message: "Unprocessable Entity, Invalid Post Body",
        data: null,
      } as IRestDefaultResponse);

    const url: CreateUrlParser = req.body;

    const existing = await client.url.findFirst({
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
      } as IRestDefaultResponse);
    }

    // generate uuid from crypto lib
    try {
      const shortUrl: string = await shortenUrl(url.url);
      const newUrl = await client.url.create({
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
      } as IRestDefaultResponse);
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: null,
      } as IRestDefaultResponse);
    }
  } catch (err: any) {
    logError(err);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null,
    } as IRestDefaultResponse);
  }
});

/**
 * @apiName Translate a short url to a long url
 * @api {get} /api/url/:id Translate a short url to a long url
 * @param {string} id is the short url
 * @response IRestDefaultResponse with status,message and data
 */
app.get("/api/url/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const url = await client.url.findFirst({
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
      } as IRestDefaultResponse);
    } else {
      return res.status(404).json({
        status: 404,
        message: "Not Found",
        data: null,
      } as IRestDefaultResponse);
    }
  } catch (err: any) {
    logError(err);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null,
    } as IRestDefaultResponse);
  }
});


/* Start Server */
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
