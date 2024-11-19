import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Snackbar,
  Alert
} from '@mui/material';
import { Diagnosis, Patient, EntryWithoutId, HealthCheckRating, HealthCheckEntry, Entry } from '../../types';
import patientService from "../../services/patients";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EntryDetails from './EntryDetails';
import axios from 'axios';  // Import AxiosError and axios

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [newEntry, setNewEntry] = useState<EntryWithoutId>({
    date: "",
    description: "",
    specialist: "",
    type: "HealthCheck",
    healthCheckRating: HealthCheckRating.Healthy,
    diagnosisCodes: [],
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getById(id);
        setPatient(fetchedPatient);
      }
    };
    void fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnosesList = async () => {
      const diagnoses = await patientService.getDiagnoses();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosesList();
  }, []);

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? `${code} - ${diagnosis.name}` : `${code} (Unknown diagnosis)`;
  };

  const isHealthCheckEntry = (entry: EntryWithoutId): entry is HealthCheckEntry => {
    return entry.type === "HealthCheck";
  };

  const handleInputChange = (field: keyof EntryWithoutId) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Special handling for diagnosisCodes input
    if (field === "diagnosisCodes") {
      const codesArray = value.split(',').map(code => code.trim()).filter(code => code.length > 0);
      setNewEntry({
        ...newEntry,
        [field]: codesArray // Ensure this is always set as an array
      });
    } else {
      setNewEntry({
        ...newEntry,
        [field]: value
      });
    }
  };

  const handleHealthCheckRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isHealthCheckEntry(newEntry)) {
      const rating = Number(event.target.value) as HealthCheckRating;
      setNewEntry({
        ...newEntry,
        healthCheckRating: rating
      });
    }
  };

  const handleSubmit = async () => {
  // Check for HealthCheckRating being greater than 3
  if (isHealthCheckEntry(newEntry) && newEntry.healthCheckRating > 3) {
    setErrorMessage("Health Check Rating cannot be greater than 3.");
    setSuccessMessage(null);
    setSnackbarOpen(true); // Open snackbar for error
    return; // Stop the submission
  }

  if (id && newEntry.description && newEntry.date && newEntry.specialist) {
    try {
      const addedEntry = await patientService.addEntry(id, newEntry);
      const entryWithId: Entry = {
        ...newEntry,
        id: addedEntry.id
      };

      if (patient) {
        setPatient({
          ...patient,
          entries: [...patient.entries, entryWithId]
        });
      }

      setSuccessMessage("Entry added successfully!");
      setErrorMessage(null);
      setSnackbarOpen(true); // Open the snackbar

      setNewEntry({
        date: "",
        description: "",
        specialist: "",
        type: "HealthCheck",
        healthCheckRating: HealthCheckRating.Healthy,
        diagnosisCodes: [],
      });
    }
    catch (error) {
        console.error("Failed to add entry", error);

        // Check if error is an Axios error
        if (axios.isAxiosError(error)) {
          setErrorMessage("Failed to add entry: " + (error.response?.data?.error || "An unknown error occurred"));
        } else if (error instanceof Error) {
          setErrorMessage("Failed to add entry: " + error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }

        setSuccessMessage(null);
        setSnackbarOpen(true); // Open the snackbar on error
      }
    } else {
      setErrorMessage("Please fill out all required fields");
      setSuccessMessage(null);
      setSnackbarOpen(true); // Open the snackbar for missing fields
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient Information
        </Typography>
      </Box>

      {/* Patient Details */}
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={patient.id}>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>{patient.occupation}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={successMessage ? 'success' : 'error'}>
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>

      {/* New Entry Form */}
      <Box mb={3} border={1} borderRadius={2} p={2}>
        <Typography variant="h6">New HealthCheck entry</Typography>
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={newEntry.description}
          onChange={handleInputChange("description")}
        />
        <TextField
          label="Date"
          fullWidth
          margin="normal"
          value={newEntry.date}
          onChange={handleInputChange("date")}
        />
        <TextField
          label="Specialist"
          fullWidth
          margin="normal"
          value={newEntry.specialist}
          onChange={handleInputChange("specialist")}
        />
        {/* Render healthCheckRating input only for HealthCheckEntry */}
        {isHealthCheckEntry(newEntry) && (
          <TextField
            label="Healthcheck rating"
            fullWidth
            margin="normal"
            type="number"
            value={newEntry.healthCheckRating || 0}
            onChange={handleHealthCheckRatingChange} // Use the dedicated handler
          />
        )}
        <TextField
          label="Diagnosis codes"
          fullWidth
          margin="normal"
          value={newEntry?.diagnosisCodes?.join(', ')} // This will work as long as diagnosisCodes is an array
          onChange={handleInputChange("diagnosisCodes")}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="secondary" onClick={() => setNewEntry({ ...newEntry, diagnosisCodes: [] })}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add
          </Button>
        </Box>
      </Box>

      {/* Entries */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Entries
        </Typography>
        {patient.entries.length === 0 ? (
          <Typography variant="body2">No entries available</Typography>
        ) : (
          patient.entries.map((entry) => (
            <Box key={entry.id} border={1} borderRadius={2} padding={2} marginBottom={2}>
              <Typography variant="body1"><strong>{entry.date}</strong> - {entry.description}</Typography>
              <Typography variant="body2">Specialist: {entry.specialist}</Typography>
              {entry.diagnosisCodes && (
                <Typography variant="body2">
                  Diagnosis Codes: {entry.diagnosisCodes.map(code => getDiagnosisName(code)).join(', ')}
                </Typography>
              )}
              <EntryDetails entry={entry} />
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default PatientPage;
