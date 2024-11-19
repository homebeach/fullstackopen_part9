import { Typography } from '@mui/material';
import { Entry } from '../../types';
import HealthRatingBar from '../HealthRatingBar';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div>
          <Typography variant="body1">Discharge Date: {entry.discharge?.date}</Typography>
          <Typography variant="body1">Discharge Criteria: {entry.discharge?.criteria}</Typography>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <Typography variant="body1">Employer: {entry.employerName}</Typography>
          {entry.sickLeave && (
            <div>
              <Typography variant="body1">Sick Leave Start: {entry.sickLeave.startDate}</Typography>
              <Typography variant="body1">Sick Leave End: {entry.sickLeave.endDate}</Typography>
            </div>
          )}
        </div>
      );
    case "HealthCheck":
      return (
        <div>
          <Typography variant="body1">Health Rating:</Typography>
          <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
        </div>
      );
    default:
      return assertNever(entry); // Exhaustive type checking
  }
};

export default EntryDetails;
