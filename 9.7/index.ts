import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises, { Result } from './exerciseCalculator'; // Assuming calculateExercises is exported properly
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());


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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/exercises', (req: any, res: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const { daily_exercises, target } = req.body;

  // Check if parameters are missing
  if (!daily_exercises || !target) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return res.status(400).json({ error: "parameters missing" });
  }

  // Check if daily_exercises is an array and target is a number
  if (!Array.isArray(daily_exercises) || typeof target !== 'number') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return res.status(400).json({ error: "parameters must be an array of numbers" });
  }

  // Calculate exercise result
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result: Result = calculateExercises(daily_exercises, target);

  // Send response
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
