import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import Cookies from 'js-cookie';
import axios from 'axios';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { get } from 'http';

export const OverviewDoctors = (props) => {
  const router = useRouter();
  const { doctors=[], sx } = props;

  const username = Cookies.get("username");
  console.log(username);
  const getSelectedDoctorAppointments = (username) => {
    console.log(username);
    router.push(`/user/appointments?doctorUsername=${username}`);
  }

  const viewDoctorProfile = (username, counter) => {
    console.log(username);
    router.push(`/user/doctor-info?doctorUsername=${username}&counter=${counter}`);
  }
 
  return (
    <CardContent>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={2}
      >
        {doctors.map((doctor, index) => {
          return (
            <Card
              key={doctor._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <ListItemAvatar>
                  {doctor.Picture ? (
                    <Box
                      component="img"
                      src={doctor.Picture}
                      sx={{
                        borderRadius: '70%',
                        height: 130,
                        width: 130,
                        objectFit: 'cover',
                        margin: '0 auto',
                      }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={`/assets/avatars/${index%16}.png`}
                      sx={{
                        borderRadius: '50%',
                        backgroundColor: 'neutral.200',
                        height: 120,
                        width: 120,
                      }}
                    />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={doctor.FirstName + ' ' + doctor.LastName}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>

              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => {getSelectedDoctorAppointments(doctor.Username)}}
                >
                  View Appointments
                </Button>
              </CardActions>
              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => {viewDoctorProfile(doctor.Username, index)}}
                >
                  View Profile
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
      <Divider />
    </CardContent>
  );
};

OverviewDoctors.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
