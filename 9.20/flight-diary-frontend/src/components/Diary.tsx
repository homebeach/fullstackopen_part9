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
  const [newDiary, setNewDiary] = useState<DiaryEntry>({
    id: 0, // Temporary placeholder; actual ID will come from the server
    date: '',
    weather: Weather.Sunny,
    visibility: Visibility.Great,
    comment: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/diaries');
      if (!response.ok) throw new Error('Failed to fetch diaries');
      const data = await response.json();
      setDiaries(data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setErrorMessage('Error fetching diaries');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDiary(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleWeatherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiary(prevState => ({
      ...prevState,
      weather: e.target.value as Weather,
    }));
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiary(prevState => ({
      ...prevState,
      visibility: e.target.value as Visibility,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiary),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the JSON error message
        throw new Error(errorData.error || 'Failed to add diary entry');
      }

      const addedEntry = await response.json(); // Parse the new diary entry data
      setDiaries(prevDiaries => [...prevDiaries, addedEntry]);

      // Reset the form after successful entry
      setNewDiary({
        id: 0, // Temporary ID placeholder
        date: '',
        weather: Weather.Sunny,
        visibility: Visibility.Great,
        comment: '',
      });
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      // Set the specific error message from the server, or generic if no details
      setErrorMessage(`Error adding diary entry: ${(error as Error).message}`);
      console.error('Error adding diary entry:', error);
    }
  };

  return (
    <div>
      <h1>Diaries</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <br />
        <input
          type="date"
          name="date"
          value={newDiary.date}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>Weather:</label>
        <br />
        {Object.values(Weather).map(weather => (
          <label key={weather}>
            <input
              type="radio"
              name="weather"
              value={weather}
              checked={newDiary.weather === weather}
              onChange={handleWeatherChange}
            />
            {weather}
          </label>
        ))}
        <br />

        <label>Visibility:</label>
        <br />
        {Object.values(Visibility).map(visibility => (
          <label key={visibility}>
            <input
              type="radio"
              name="visibility"
              value={visibility}
              checked={newDiary.visibility === visibility}
              onChange={handleVisibilityChange}
            />
            {visibility}
          </label>
        ))}
        <br />

        <label>Comment:</label>
        <br />
        <textarea
          name="comment"
          value={newDiary.comment}
          onChange={handleInputChange}
          required
        />
        <br />
        <button type="submit">Add Diary Entry</button>
      </form>

      {diaries.map((diary) => (
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
