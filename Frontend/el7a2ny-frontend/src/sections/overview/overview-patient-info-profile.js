import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';
  
  export const OverviewPatientInfoProfile = ({patient}) => {
    


    return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            component="img"
            src={`/assets/avatars/${2}.png`}
            sx={{
              borderRadius: '100%',
              height: 150,
              mb: 2,
              width: 150
              
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {patient.FirstName + " " + patient.LastName}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {patient.Gender} {patient.Age}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  )};
  