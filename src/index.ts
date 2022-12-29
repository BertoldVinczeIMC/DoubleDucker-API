/* modules */
import express, { Express, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

/* Local modules */
import { validate } from "./validation/body_parser";
import { shortenUrl } from "./crypto";
import { logMiddleware, logError } from "./logger";

/* Types */
import { IRestDefaultResponse } from "./types/rest_response";
import {
  CreateUrlParser,
  UrlSchema,
  LoginUserParser,
  LoginUserSchema,
  RegisterUserParser,
  RegisterUserSchema,
} from "./schemas/body";

import { createuuid } from "./crypto";

import {
  createToken,
  checkToken,
  IRequest,
  decodeToken,
  getToken,
} from "./auth/token";

/* App Setup */

const app: Express = express();

const client: PrismaClient = new PrismaClient();

dotenv.config();

const PORT = process.env.PORT;

/* Middlewares */

app.use(cors());
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
app.post("/api/url", checkToken, async (req: Request, res: Response) => {
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
      const tmp: any = decodeToken(getToken(req) as string);
      const newUrl = await client.url.create({
        data: {
          decoded: url.url,
          encoded: shortUrl,
          user_id: tmp.user.user_id,
        },
      });
      return res.status(200).json({
        status: 200,
        message: "OK",
        data: newUrl,
      } as IRestDefaultResponse);
    } catch (err: any) {
      logError(err);
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
app.get("/api/url/:id", checkToken, async (req: Request, res: Response) => {
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


/**
 * @apiName GetUrls
 * @api {get} /api/urls GetUrls
 * @header {string} Authorization Bearer
 * @response IRestDefaultResponse with status,message and data
 */
app.get("/api/urls", checkToken, async (req: Request, res: Response) => {
  try {
    const tmp: any = decodeToken(getToken(req) as string);
    const user_id = tmp.user.user_id;
    const urls = await client.url.findMany({
      select: {
        decoded: true,
        encoded: true,
        user_id: false,
        created_at: true,
      },
      where: {
        user_id: user_id,
      },
    });
    return res.status(200).json({
      status: 200,
      message: "OK",
      data: urls, 
    } as IRestDefaultResponse);
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
 * @apiName Delete a short url
 * @api {delete} /api/url/:id Delete a short url
 * @param {string} id is the short url
 * @response IRestDefaultResponse with status,message and data
 */
app.delete("/api/url/:id", checkToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const tmp: any = decodeToken(getToken(req) as string);
    const user_id = tmp.user.user_id;
    const url = await client.url.findFirst({
      select: {
        decoded: true,
        encoded: true,
        user_id: true,
      },
      where: {
        encoded: id,
      },
    });
    if (url) {
      if (url.user_id === user_id) {
        await client.url.delete({
          where: {
            encoded: id,
          },
        });
        return res.status(200).json({
          status: 200,
          message: "OK",
          data: null,
        } as IRestDefaultResponse);
      } else {
        return res.status(403).json({
          status: 403,
          message: "Forbidden",
          data: null,
        } as IRestDefaultResponse);
      }
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

/**
 * @apiName Login
 * @api {post} /api/login Login
 * @body {JSON} body will be parsed and validated. Valid body is {username: string, password: string}
 * @response IRestDefaultResponse with status,message and token
 */
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const valid = await validate(req.body, LoginUserSchema);
    if (!valid) {
      return res.status(422).json({
        status: 422,
        message: "Unprocessable Entity, Invalid Post Body",
        data: null,
      } as IRestDefaultResponse);
    }
    const user: LoginUserParser = req.body;
    const auth_user = await client.auth.findFirst({
      where: {
        email: user.email,
      },
    });
    if (auth_user) {
      const match = await bcrypt.compare(user.password, auth_user.password);
      if (match) {
        const token = createToken({
          email: user.email,
          user_id: auth_user.user_id,
        });
        return res.status(200).json({
          status: 200,
          message: "OK",
          data: token,
        } as IRestDefaultResponse);
      } else {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
          data: null,
        } as IRestDefaultResponse);
      }
    } else {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
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
 * @apiName Register
 * @api {post} /api/register Register
 * @body {JSON} body will be parsed and validated. Valid body is {username: string, password: string, email: string,secret: string}
 * @response IRestDefaultResponse with status,message and token
 */
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const valid = await validate(req.body, RegisterUserSchema);
    if (!valid) {
      return res.status(422).json({
        status: 422,
        message: "Unprocessable Entity, Invalid Post Body",
        data: null,
      } as IRestDefaultResponse);
    }

    const user = req.body as RegisterUserParser;

    // If secret is not correct, return 401
    if (user.secret !== process.env.SECRET) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      } as IRestDefaultResponse);
    }

    // Check if user already exists
    const existing = await client.auth.findFirst({
      where: {
        email: user.email,
      },
    });
    if (existing) {
      return res.status(409).json({
        status: 409,
        message: "Conflict, User already exists",
        data: null,
      } as IRestDefaultResponse);
    }

    const uuid = await createuuid();
    const hashedPassword = await bcrypt.hash(user.password, 2);
    const newUser = await client.auth.create({
      data: {
        user_id: uuid,
        email: user.email,
        password: hashedPassword,
      },
    });

    const token = await createToken({
      email: newUser.email,
      user_id: newUser.user_id,
    });
    return res.status(200).json({
      status: 200,
      message: "User created",
      data: token,
    } as IRestDefaultResponse);
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
