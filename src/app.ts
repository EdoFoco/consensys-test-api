import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Container } from "typeorm-typedi-extensions";
import * as typeorm from "typeorm";
import {
  MeetingRoomResolver,
  UserResolver,
  ReservationResolver,
} from "./resolvers";

const main = async () => {
  typeorm.useContainer(Container);
  await typeorm.createConnection();

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MeetingRoomResolver, UserResolver, ReservationResolver],
      validate: false,
      container: Container,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(
    parseInt(process.env.PORT != undefined ? process.env.PORT : "3001"),
    () => {
      console.log("Server started!!");
    }
  );
};

main().catch((err) => {
  console.error(err);
});
