import express from 'express';
const app = express();
import diaryRouter from './routes/diaries';
import cors from 'cors'; // Import the cors middleware
app.use(express.json());

const PORT = 3000;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors()); // Use cors middleware

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});