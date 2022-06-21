import { Request, Response } from "express";
import { ApiContext, Identity } from "../middleware";

export const createFakeApiContext = (
  body: unknown | undefined,
  sub: string | undefined
): ApiContext => {
  return {
    req: {
      body,
    } as Request,
    res: {} as Response,
    identity: {
      sub: sub,
    } as Identity,
  };
};
