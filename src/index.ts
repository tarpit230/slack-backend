import express, { type Application, type Request, type Response } from 'express';
import connectDB from './config/db.js';
import authRoute from './routes/auth.route.js'
import bodyParser from 'body-parser';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript Express!');
});

app.use('/', authRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
