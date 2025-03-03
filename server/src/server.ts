import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import db from './config/connection.js';
import routes from './routes/index.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { getUserFromToken } from './auth.js';
import { json } from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Apollo Server setup
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apply Apollo Server middleware
app.use(
  '/graphql',
  json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization;
      const user = getUserFromToken(authHeader);
      return { user };
    },
  })
);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// RESTful API routes
app.use(routes);

// Start server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`🚀 GraphQL available at http://localhost:${PORT}/graphql`);
  });
});

