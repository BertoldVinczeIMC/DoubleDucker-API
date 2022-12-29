import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export interface IRequest extends Request {
  user: any;
}

export const createToken = (user: any) => {
  return jwt.sign({ user }, process.env.SECRET as string, { expiresIn: "24h" });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const getToken = (req: Request) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    return token;
  }
  return null;
};

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);
  if (token) {
    try {
      const user = verifyToken(token, process.env.SECRET as string);
      (req as IRequest).user = user;
    } catch (err) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      data: null,
    });
  }
  next();
};
