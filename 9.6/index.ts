import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/hello', (_req: any, res: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  res.send('Hello Full Stack!');
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/bmi', (req: any, res: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const height: number = Number(req.query.height);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const weight: number = Number(req.query.weight);

  // Check if height and weight are valid numbers
  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmiStatus = calculateBmi(height, weight);
  
  const response = {
    height: height,
    weight: weight,
    bmi: bmiStatus
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  res.json(response);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
