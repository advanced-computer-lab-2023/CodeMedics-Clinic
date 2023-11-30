import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const OverviewDoctorInfoDetails = ({doctor}) => {
  

  return (
    <Card>
      <CardHeader
        title={doctor.FirstName + "'s Profile"}
      />
      <CardContent sx={{ pt: 0 }}>
        {Object.keys(doctor).length !== 0 && 
        <Box sx={{ m: -1.5 }}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="First name"
                name="firstName"
                value={doctor.FirstName}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                value={doctor.LastName}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={doctor.Email}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Hourly Rate"
                name="rate"
                type="number"
                value={doctor.HourlyRate}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Speciality"
                name="speciality"
                value={doctor.Speciality}
              />
            </Grid>
          </Grid>
        </Box>}
      </CardContent>
      <Divider />
    </Card>
  );
};
