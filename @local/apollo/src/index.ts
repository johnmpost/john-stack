import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { helloWorld } from "@local/common/src/utils";
import { Resolvers } from "@local/graphql";
import { readFileSync } from "fs";
import path from "path";

console.log(helloWorld);

const schemaPath = path.join(__dirname, "../../graphql/src/schema.gql");
const typeDefs = readFileSync(schemaPath, "utf8");

const resolvers: Resolvers = {};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, { listen: { port: 4001 } }).then(({ url }) =>
  console.log(`Server ready at ${url}`)
);
