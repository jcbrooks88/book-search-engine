declare namespace Express {
  export interface Request {
    user: {
      _id: unknown;
      username: string;
      email: string;
    };
  }
}
