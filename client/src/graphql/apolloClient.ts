import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define the GraphQL server endpoint
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI, // This will fetch from the environment variable
});

// Middleware to attach auth token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Attach token if available
    },
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Concatenate auth middleware with the HTTP link
  cache: new InMemoryCache(), // Use InMemoryCache for caching GraphQL queries
});

export default client;
