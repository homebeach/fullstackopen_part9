import React from 'react';
import Part from './Part';

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

interface ContentProps {
    courseParts: CoursePart[];
}

const Content: React.FC<ContentProps> = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
  );
};

export default Content;
