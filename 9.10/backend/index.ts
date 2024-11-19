import express from 'express';
import cors from 'cors';
import data from './data/diagnoses';


const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Define the Diagnosis type
interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

const diagnoses: Diagnosis[] = data


// Define a route to get all diagnoses
app.get('/api/diagnoses', (_req: any, res: any) => {
    res.send(diagnoses);
});

app.get('/api/ping', (_req: any, res: any) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
