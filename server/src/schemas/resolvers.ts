import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// Query to get a single user by ID or username
const getSingleUser = async (_: any, { userId, username }: { userId?: string; username?: string }) => {
  try {
    const foundUser = await User.findOne({
      $or: [{ _id: userId }, { username: username }],
    });

    if (!foundUser) {
      throw new Error('Cannot find a user with this id or username!');
    }

    return foundUser;
  } catch (err) {
    throw new Error('Error fetching user');
  }
};

// Mutation to create a new user
const createUser = async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
  try {
    const user = await User.create({ username, email, password });

    if (!user) {
      throw new Error('Something went wrong while creating the user!');
    }

    const token = signToken(user.username, user.email, user._id);
    return { token, user };
  } catch (err) {
    throw new Error('Error creating user');
  }
};

// Mutation for user login
const login = async (_: any, { username, email, password }: { username?: string; email?: string; password: string }) => {
  try {
    const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

    if (!user) {
      throw new Error("Can't find this user");
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new Error('Wrong password!');
    }

    const token = signToken(user.username, user.email, user._id);
    return { token, user };
  } catch (err) {
    throw new Error('Error logging in');
  }
};

// Mutation to save a book to a user's savedBooks
const saveBook = async (_: any, { bookData }: { bookData: any }, context: any) => {
  try {
    const user = context.user;

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { savedBooks: bookData } },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (err) {
    throw new Error('Error saving book');
  }
};

// Mutation to remove a book from savedBooks
const deleteBook = async (_: any, { bookId }: { bookId: string }, context: any) => {
  try {
    const user = context.user;

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId } } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Couldn't find user with this id!");
    }

    return updatedUser;
  } catch (err) {
    throw new Error('Error deleting book');
  }
};

// Export all resolvers
export const resolvers = {
  Query: {
    getSingleUser,
  },
  Mutation: {
    addUser: createUser, // Rename createUser to match typeDefs.ts
    login,
    saveBook,
    removeBook: deleteBook, // Rename deleteBook to match typeDefs.ts
  },
};

