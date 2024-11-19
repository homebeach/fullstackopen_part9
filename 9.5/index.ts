import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

app.get('/hello', (_req: any, res: any) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: any, res: any) => {
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  // Check if height and weight are valid numbers
  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmiStatus = calculateBmi(height, weight);
  
  const response = {
    height: height,
    weight: weight,
    bmi: bmiStatus
  };

  res.json(response);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
