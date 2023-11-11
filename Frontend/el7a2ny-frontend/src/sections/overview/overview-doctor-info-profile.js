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
  
  export const OverviewDoctorInfoProfile = ({doctor}) => {
    
    

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
          <Avatar
            src={doctor.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {doctor.FirstName + " " + doctor.LastName}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {doctor.affiliation} {doctor.Degree}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  )};
  