import React from 'react';


interface CoursePartBase {
    name: string;
    exerciseCount: number;
}

interface CoursePartExtended extends CoursePartBase {
    description: string;
}

interface CoursePartBasic extends CoursePartExtended {
    kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
}

interface CoursePartBackground extends CoursePartExtended {
    backgroundMaterial: string;
    kind: "background"
}

interface CoursePartSpecial extends CoursePartExtended {
    requirements: string[];
    kind: "special";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;


interface PartProps {
    part: CoursePart;
}

const Part: React.FC<PartProps> = ({ part }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <div>
          <p>Name: {part.name}</p>
          <p>Exercise Count: {part.exerciseCount}</p>
          <p>Description: {part.description}</p>
        </div>
      );
    case 'group':
      return (
        <div>
          <p>Name: {part.name}</p>
          <p>Exercise Count: {part.exerciseCount}</p>
          <p>Group Project Count: {part.groupProjectCount}</p>
        </div>
      );
    case 'background':
      return (
        <div>
          <p>Name: {part.name}</p>
          <p>Exercise Count: {part.exerciseCount}</p>
          <p>Description: {part.description}</p>
          <p>Background Material: {part.backgroundMaterial}</p>
        </div>
      );
    default:
      return null; // Handle unexpected types
  }
};

export default Part;
