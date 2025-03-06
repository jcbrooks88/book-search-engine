import type { User } from '../models/User.js';
import type { Book } from '../models/Book.js';

// Helper function to handle fetch responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Route to get logged-in user's info (needs the token)
export const getMe = async (token: string) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};

export const createUser = async (userData: User) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(handleResponse);
};

export const loginUser = async (userData: Partial<User>) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(handleResponse);
};

// Save book data for a logged-in user
export const saveBook = async (bookData: Book, token: string) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  }).then(handleResponse);
};

// Remove saved book data for a logged-in user
export const deleteBook = async (bookId: string, token: string) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};

// Search Google Books API
export const searchGoogleBooks = async (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
    .then(handleResponse)
    .catch((error) => {
      console.error('Error fetching Google Books:', error);
      throw error;
    });
};
