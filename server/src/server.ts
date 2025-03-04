import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import routes from './routes/index.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { getUserFromToken } from './services/auth.js';

import bodyParser from 'body-parser';
const { json } = bodyParser;


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log("🚀 Starting server initialization...");

async function startServer() {
  try {
    console.log("🚀 Initializing Apollo Server...");
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    console.log("🔄 Starting Apollo Server...");
    await apolloServer.start();
    console.log("✅ Apollo Server started!");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    console.log("🔄 Applying Apollo middleware...");
    app.use(
      '/graphql',
      json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => {
          console.log("🛂 Checking user authentication...");
          const authHeader = req.headers.authorization;
          return { user: getUserFromToken(authHeader) };
        },
      })
    );
    console.log("✅ Apollo middleware applied!");

    if (process.env.NODE_ENV === 'production') {
      console.log("📁 Serving static files...");
      app.use(express.static(path.join(__dirname, '../client/build')));
    }

    app.use(routes);
    console.log("✅ Routes loaded!");


      app.listen(PORT, () => {
        console.log(`🌍 Server running at http://localhost:${PORT}`);
        console.log(`🚀 GraphQL available at http://localhost:${PORT}/graphql`);
      });
      
  } catch (error) {
    console.error("❌ Fatal error during startup:", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error("❌ Uncaught error:", error);
});