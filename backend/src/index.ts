import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 4000;
const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Converge HTTP API] Server running on http://localhost:${PORT}`);
});
