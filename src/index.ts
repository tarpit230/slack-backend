import express, { type Application, type Request, type Response } from 'express';
import connectDB from './config/db.js';

const app: Application = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
