// Total.tsx
import React from 'react';

interface Part {
  name: string;
  exerciseCount: number;
}

interface TotalProps {
  courseParts: Part[];
}

const Total: React.FC<TotalProps> = ({ courseParts }) => {
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  
  return (
    <div>
      <p>Number of exercises {totalExercises}</p>
    </div>
  );
};

export default Total;
