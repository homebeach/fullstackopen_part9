interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (exerciseHours: number[], target: number): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(hours => hours > 0).length;
  const average = exerciseHours.reduce((acc, cur) => acc + cur, 0) / periodLength;
  const success = average >= target;
  let rating: 1 | 2 | 3;
  let ratingDescription: string;

  if (average < target - 0.5) {
    rating = 1;
    ratingDescription = 'not good, below target';
  } else if (average < target) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 3;
    ratingDescription = 'target achieved, well done!';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

// Check if arguments are provided through npm run command
if (process.argv.length < 4) {
  console.log("Usage: npm run calculateExercises <target> <exercise_hours...>");
} else {
  // Extract target value and exercise hours from command-line arguments
  const target = Number(process.argv[2]);
  const exerciseHours = process.argv.slice(3).map(Number);
  
  // Call the function with provided target value and exercise hours
  const result = calculateExercises(exerciseHours, target);
  console.log(result);
}
