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
  const [newDiary, setNewDiary] = useState<Partial<DiaryEntry>>({
    date: '',
    weather: Weather.Sunny,
    visibility: Visibility.Great,
    comment: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDiary(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDiary)
      });
      const addedEntry = await response.json();
      setDiaries(prevDiaries => [...prevDiaries, addedEntry]);
      setNewDiary({
        date: '',
        weather: Weather.Sunny,
        visibility: Visibility.Great,
        comment: '',
      });
    } catch (error) {
      console.error('Error adding diary entry:', error);
    }
  };

  return (
    <div>
      <h1>Diaries</h1>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <br />
        <input type="text" name="date" value={newDiary.date} onChange={handleInputChange} required />
        <br />
        <label>Weather:</label>
        <br />
        <select name="weather" value={newDiary.weather} onChange={handleInputChange} required>
          {Object.values(Weather).map(weather => (
            <option key={weather} value={weather}>{weather}</option>
          ))}
        </select>
        <br />
        <label>Visibility:</label>
        <br />
        <select name="visibility" value={newDiary.visibility} onChange={handleInputChange} required>
          {Object.values(Visibility).map(visibility => (
            <option key={visibility} value={visibility}>{visibility}</option>
          ))}
        </select>
        <br />
        <label>Comment:</label>
        <br />
        <textarea name="comment" value={newDiary.comment} onChange={handleInputChange} required />
        <br />
        <button type="submit">Add Diary Entry</button>
      </form>
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
