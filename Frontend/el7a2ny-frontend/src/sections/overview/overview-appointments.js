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

export const OverviewAppointments = (props) => {
  const router = useRouter();
  const { appointments=[], sx } = props;

  const [selectedDoctors, setSelectedDoctors] = useState({});

  const username = Cookies.get("username");
  console.log(username);

 
  return (
    <CardContent>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={2}
      >
        {appointments.map((appointment) => {
          return (
            <Card
              key={appointment._id}
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
                  {appointment.Picture ? (
                    <Box
                      component="img"
                      src={appointment.Picture}
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
                  primary={appointment.FirstName + ' ' + appointment.LastName}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItemText
                secondary={appointment.HourlyRate}
                primaryTypographyProps={{variant: 'subtitle2'}}
                secondaryTypographyProps={{variant: 'body2'}}
                />

              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                >
                  Book
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

OverviewAppointments.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
