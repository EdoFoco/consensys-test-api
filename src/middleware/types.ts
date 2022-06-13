import { Request, Response } from "express";

export interface Identity {
  iss: string;
  sub: string;
  aud: [string];
  iat: number;
  exp: number;
  scope: string;
}

export interface ApiContext {
  req: Request;
  res: Response;
  identity: Identity;
}
