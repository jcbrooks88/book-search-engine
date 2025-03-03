import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import { getUserFromToken } from './services/auth';
import typeDefs from './schema/typeDefs'; // Add this line to import typeDefs
import resolvers from './resolvers'; // Add this line to import resolvers

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/graphql',
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization;
      const user = getUserFromToken(authHeader);
      return { user };
    },
  })
);

app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000/graphql');
});
