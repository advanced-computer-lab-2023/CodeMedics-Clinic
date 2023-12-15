import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import axios from 'axios';
import FileSaver from 'file-saver';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';

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
  Stack,
  TextField,
} from '@mui/material';

export const RescheduleAppointment = (props) => {
  const router = useRouter();
  const username = Cookies.get('username');

  const appointmentID = new URLSearchParams(window.location.search).get('appointmentID');

  const [formData, setFormData] = useState({
    appointmentId: appointmentID,
    startHour: '',
    endHour: '',
    date: '',
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const patientUsername = new URLSearchParams(window.location.search).get('username');

  const rescheduleAppointment = () => {
    const axiosPromise = axios.patch(
      `http://localhost:8000/doctor/rescheduleAppointments/${patientUsername}`,
      formData,
      { withCredentials: true }
    );
    const redirectPromise = router.push(`/doctor/viewAppointments?username=${patientUsername}`); // Replace '/your-target-page' with your actual target page

    Promise.all([axiosPromise, redirectPromise])
      .then(([axiosResponse]) => {
        console.log(axiosResponse);
        router.refresh();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <CardContent>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={2}
      >
        <TextField
          label="Start Hour"
          name="startHour"
          value={formData.startHour}
          onChange={handleChange}
        />
        <TextField
          label="End Hour"
          name="endHour"
          value={formData.endHour}
          onChange={handleChange}
        />
        <TextField
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={rescheduleAppointment}
        >
          Reschedule
        </Button>
      </Box>
    </CardContent>
  );
};

RescheduleAppointment.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default RescheduleAppointment;
