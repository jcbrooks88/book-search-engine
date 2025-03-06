import { Response } from 'express';
import express from 'express';
const router = express.Router();

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import apiRoutes from './api/index.js';

// API routes
router.use('/api', apiRoutes);

// Serve up React front-end in production
router.get('*', (res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

export default router;
