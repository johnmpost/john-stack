import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { Resolvers } from "./graphql-types";

const schemaPath = path.join(__dirname, "schema.gql");
const typeDefs = readFileSync(schemaPath, "utf8");

const resolvers: Resolvers = { Query: {} };

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server).then(({ url }) =>
  console.log(`Server ready at ${url}`)
);
