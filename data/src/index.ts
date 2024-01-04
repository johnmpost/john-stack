import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers, typeDefs } from "./schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server).then(({ url }) =>
  console.log(`Server ready at ${url}`)
);
