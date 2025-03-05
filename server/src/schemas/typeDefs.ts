import gql from 'graphql-tag';

// Define the Book Input type for passing parameters when saving a book
const bookInputType = gql`
  input BookInput {
    bookId: String!
    authors: [String!]!
    description: String!
    title: String!
    image: String
    link: String
  }
`;

// GraphQL Schema Definition
export const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String!]!
    description: String!
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  # Query type
type Query {
  # Returns the current authenticated user
  me: User

  # Fetch a single user by ID or username
  getSingleUser(userId: ID, username: String): User
}

type Mutation {
  # Login a user, returning the token and user information
  login(email: String!, password: String!): Auth

  # Register a new user and return the token and user information
  addUser(username: String!, email: String!, password: String!): Auth

  # Save a book to the user's savedBooks list and return the updated User
  saveBook(bookData: BookInput!): User

  # Remove a book from the user's savedBooks list and return the updated User
  removeBook(bookId: String!): User
}


  # Book Input Type (used in mutations like saveBook)
  ${bookInputType}
`;
