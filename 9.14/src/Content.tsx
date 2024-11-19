// Content.tsx
import React from 'react';

interface Part {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  courseParts: Part[];
}

const Content: React.FC<ContentProps> = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map((part, index) => (
        <p key={index}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  );
};

export default Content;
