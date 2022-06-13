const jwt = require("jsonwebtoken");
import jwks from "jwks-rsa";
import { MiddlewareFn } from "type-graphql";
import { ForbiddenError } from "apollo-server-express";
import { Identity, ApiContext } from "./types";

interface AuthOptions {
  audience: string;
  issuer: string;
  algorithms: string[];
}

const options: AuthOptions = {
  audience: process.env.JWT_AUDIENCE ?? "",
  issuer: process.env.JWT_ISSUER ?? "",
  algorithms: ["RS256"],
};

const client = jwks({
  jwksUri: process.env.JWT_JWKS_URL ?? "",
});

function getKey(header: any, cb: any) {
  client.getSigningKey(header.kid, function (_: any, key: any) {
    var signingKey = key?.publicKey || key?.rsaPublicKey;
    cb(null, signingKey);
  });
}

const resolveToken = async (
  token: string | undefined,
  options: AuthOptions
) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err: any, decoded: any) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export const isAuth: MiddlewareFn<ApiContext> = async ({ context }, next) => {
  try {
    const token = context.req.headers.authorization?.replace("Bearer ", "");

    if (!token || token === "") throw new Error("No token");

    const identity = await resolveToken(token, options);
    context.identity = identity as Identity;

    return next();
  } catch (err) {
    throw new ForbiddenError("Forbidden");
  }
};
