// src/components/Diary.tsx
import React, { useEffect, useState } from 'react';

enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}

enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}

interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

const Diary: React.FC = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/diaries');
      const data = await response.json();
      setDiaries(data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    }
  };

  return (
    <div>
      <h1>Diaries</h1>
      {diaries.map(diary => (
        <div key={diary.id}>
          <h2>Date: {diary.date}</h2>
          <p>Weather: {diary.weather}</p>
          <p>Visibility: {diary.visibility}</p>
          <p>Comment: {diary.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default Diary;
