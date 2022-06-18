import jwt, { VerifyOptions, JwtHeader } from "jsonwebtoken";
import jwks from "jwks-rsa";
import { MiddlewareFn } from "type-graphql";
import { ForbiddenError } from "apollo-server-express";
import { Identity, ApiContext } from "./types";

const options: VerifyOptions = {
  audience: process.env.JWT_AUDIENCE ?? "",
  issuer: process.env.JWT_ISSUER ?? "",
  algorithms: ["RS256"],
};

const client = jwks({
  jwksUri: process.env.JWT_JWKS_URL ?? "",
});

/** Todo: I suspect there is an issue with the VerifyCallback typings. Use any for nwo */
function getKey(header: JwtHeader, callback: any) {
  client.getSigningKey(header.kid, function (_: any, key: any) {
    const signingKey = key?.publicKey || key?.rsaPublicKey;
    callback(null, signingKey);
  });
}

const resolveToken = async (
  token: string | undefined,
  options: VerifyOptions
) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token!, getKey, options, (err, decoded) => {
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
