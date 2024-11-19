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
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { Diagnosis, Patient, EntryWithoutId, HealthCheckRating, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, Entry } from '../../types';
import patientService from "../../services/patients";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EntryDetails from './EntryDetails';
import { AxiosError } from 'axios';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [newEntry, setNewEntry] = useState<EntryWithoutId>({
    date: "",
    description: "",
    specialist: "",
    type: "HealthCheck", // Default to "HealthCheck"
    healthCheckRating: HealthCheckRating.Healthy, // Only for HealthCheck type
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

  // Type guard for HealthCheckEntry
  const isHealthCheckEntry = (entry: EntryWithoutId): entry is HealthCheckEntry => {
    return entry.type === "HealthCheck";
  };

  // Type guard for OccupationalHealthcareEntry
  const isOccupationalHealthcareEntry = (entry: EntryWithoutId): entry is OccupationalHealthcareEntry => {
    return entry.type === "OccupationalHealthcare";
  };

  // Type guard for HospitalEntry
  const isHospitalEntry = (entry: EntryWithoutId): entry is HospitalEntry => {
    return entry.type === "Hospital";
  };

const handleInputChange = (
  field: keyof EntryWithoutId | "sickLeave.startDate" | "sickLeave.endDate" | "discharge.date" | "discharge.criteria" | "employerName" | "healthCheckRating"
) => (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;

    // Handle common fields
    if (field === "description" || field === "date" || field === "specialist") {
      setNewEntry(prev => ({
        ...prev,
        [field]: value
      }));
      return; // Early return to avoid further checks
    }

    if (isHealthCheckEntry(newEntry) && field === "healthCheckRating") {
      const rating = Number(value) as HealthCheckRating;
      setNewEntry(prev => ({
        ...prev,
        healthCheckRating: rating
      }));
    } else if (isOccupationalHealthcareEntry(newEntry)) {
      if (field === "sickLeave.startDate" || field === "sickLeave.endDate") {
        const newSickLeave = newEntry.sickLeave || { startDate: '', endDate: '' };
        setNewEntry(prev => ({
          ...prev,
          sickLeave: {
            ...newSickLeave,
            startDate: field === "sickLeave.startDate" ? value : newSickLeave.startDate,
            endDate: field === "sickLeave.endDate" ? value : newSickLeave.endDate,
          }
        }));
      } else if (field === "employerName") {
        setNewEntry(prev => ({
          ...prev,
          employerName: value
        }));
      }
    } else if (isHospitalEntry(newEntry)) {
      if (field === "discharge.date" || field === "discharge.criteria") {
        const newDischarge = newEntry.discharge || { date: '', criteria: '' };
        setNewEntry(prev => ({
          ...prev,
          discharge: {
            ...newDischarge,
            date: field === "discharge.date" ? value : newDischarge.date,
            criteria: field === "discharge.criteria" ? value : newDischarge.criteria,
          }
        }));
      }
    } else {
      setNewEntry(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<EntryWithoutId['type']>) => {
      const type = event.target.value as EntryWithoutId['type'];

      // Reset the form fields based on the entry type
      if (type === "HealthCheck") {
          setNewEntry({
              date: "",
              description: "",
              specialist: "",
              type: "HealthCheck",
              healthCheckRating: HealthCheckRating.Healthy,
              diagnosisCodes: []
          });
      } else if (type === "Hospital") {
          setNewEntry({
              date: "", // Initialize
              description: "", // Initialize
              specialist: "", // Initialize
              type: "Hospital",
              discharge: { date: "", criteria: "" },
              diagnosisCodes: []
          });
      } else if (type === "OccupationalHealthcare") {
          setNewEntry({
              date: "", // Initialize
              description: "", // Initialize
              specialist: "", // Initialize
              type: "OccupationalHealthcare",
              employerName: "",
              sickLeave: { startDate: "", endDate: "" },
              diagnosisCodes: []
          });
      }
  };


  interface ErrorResponse {
    error: string; // Adjust this according to your API's error response structure
  }

  const handleSubmit = async () => {
    // Validate HealthCheckRating
    if (isHealthCheckEntry(newEntry) && newEntry.healthCheckRating > 3) {
      setErrorMessage("Health Check Rating cannot be greater than 3.");
      setSuccessMessage(null);
      setSnackbarOpen(true); // Open snackbar for error
      return; // Stop the submission
    }

    // Validate employerName for OccupationalHealthcareEntry
    if (isOccupationalHealthcareEntry(newEntry) && !newEntry.employerName) {
      setErrorMessage("Employer Name is required for Occupational Healthcare entries.");
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
      } catch (error) {
        console.error("Failed to add entry", error);

        // Type assertion to AxiosError
        const typedError = error as AxiosError<ErrorResponse>; 

        // Check if the response and data exist before accessing them
        const errorMessage = typedError.response?.data?.error || "An unknown error occurred";

        setErrorMessage("Failed to add entry: " + errorMessage);
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
        <Typography variant="h6">New Entry</Typography>

        {/* Select Entry Type */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Entry Type</InputLabel>
          <Select value={newEntry.type} onChange={handleTypeChange}>
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
        </FormControl>

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
        {isHealthCheckEntry(newEntry) && (
          <TextField
            label="HealthCheck Rating"
            fullWidth
            margin="normal"
            type="number"
            value={newEntry.healthCheckRating || 0}
            onChange={handleInputChange("healthCheckRating")}
          />
        )}
        {isOccupationalHealthcareEntry(newEntry) && (
            <>
                <TextField
                    label="Employer Name"
                    fullWidth
                    margin="normal"
                    value={newEntry.employerName || ""}
                    onChange={handleInputChange("employerName")}
                />
                <TextField
                    label="Sick Leave Start Date"
                    fullWidth
                    margin="normal"
                    value={newEntry.sickLeave?.startDate || ""}
                    onChange={handleInputChange("sickLeave.startDate")}
                />
                <TextField
                    label="Sick Leave End Date"
                    fullWidth
                    margin="normal"
                    value={newEntry.sickLeave?.endDate || ""}
                    onChange={handleInputChange("sickLeave.endDate")}
                />
            </>
        )}
        {isHospitalEntry(newEntry) && (
            <>
                <TextField
                    label="Discharge Date"
                    fullWidth
                    margin="normal"
                    value={newEntry.discharge?.date || ""}
                    onChange={handleInputChange("discharge.date")}
                />
                <TextField
                    label="Discharge Criteria"
                    fullWidth
                    margin="normal"
                    value={newEntry.discharge?.criteria || ""}
                    onChange={handleInputChange("discharge.criteria")}
                />
            </>
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
