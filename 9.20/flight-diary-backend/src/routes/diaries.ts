import express from 'express';

import diaryService from '../services/diaryService';

import toNewDiaryEntry from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body); // Validate and convert the data
    const addedEntry = diaryService.addDiary(newDiaryEntry); // Add to the diary
    res.status(201).json(addedEntry); // Respond with the newly created entry
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    
    if (error instanceof Error) {
      errorMessage = error.message;  // Use error message from validation or other issues
    }

    // Return JSON error response with a 400 status for validation issues
    res.status(400).json({ error: errorMessage });
  }
});

export default router;