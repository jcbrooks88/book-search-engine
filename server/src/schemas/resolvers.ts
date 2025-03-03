import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import type { JwtPayload } from '../services/auth.js';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: { user?: JwtPayload }) => {
      if (!context.user) throw new Error('Not authenticated');
      return User.findById(context.user._id);
    },
  },

  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('No user found');

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new Error('Incorrect password');

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addUser: async (
      _parent: any,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (
      _parent: any,
      { bookData }: any,
      context: { user?: JwtPayload }
    ) => {
      if (!context.user) throw new Error('Not authenticated');

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: { user?: JwtPayload }
    ) => {
      if (!context.user) throw new Error('Not authenticated');

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      return updatedUser;
    },
  },
};
