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
  Stack
} from '@mui/material';
import { get } from 'http';

export const OverviewDoctors = (props) => {
  const router = useRouter();
  const { doctors=[], sx } = props;

  const username = Cookies.get("username");
  const getSelectedDoctorAppointments = (username) => {
    router.push(`/user/appointments?doctorUsername=${username}`);
  }

  const viewDoctorProfile = (username, counter) => {
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
              key={doctor.doctor._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                width: '100%',
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
                  {doctor.doctor.Picture ? (
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
                  primary={doctor.doctor.FirstName + ' ' + doctor.doctor.LastName}
                  primaryTypographyProps={{ variant: 'h6' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  primary= {doctor.doctor.Speciality}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  // secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  primary= {doctor.price + ' EGP'}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  // secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              
              <Stack direction="row">
                <CardActions>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => {getSelectedDoctorAppointments(doctor.doctor.Username)}}
                  >
                     Appointments
                  </Button>
                </CardActions>
                <CardActions>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => {viewDoctorProfile(doctor.doctor.Username, index)}}
                  >
                    View Profile
                  </Button>
                </CardActions>
              </Stack>
            </Card>
          );
        })}
      </Box>
    </CardContent>
  );
};

OverviewDoctors.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
