import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { apollo, parseConfig } from "@local/common/src/config";
import { helloWorld } from "@local/common/src/utils";
import { Resolvers } from "@local/graphql";
import { readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const config = parseConfig(apollo)(process.env);

console.log(helloWorld);
console.log(config);

const schemaPath = path.join(__dirname, "../../graphql/src/schema.gql");
const typeDefs = readFileSync(schemaPath, "utf8");

const resolvers: Resolvers = {};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, { listen: { port: config.APOLLO_PORT } }).then(
  ({ url }) => console.log(`Server ready at ${url}`)
);
