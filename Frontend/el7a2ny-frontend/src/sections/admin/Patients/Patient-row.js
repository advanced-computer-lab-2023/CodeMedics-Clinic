import PropTypes from 'prop-types';
import { Fragment } from 'react';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpTrayIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import AdjustmentsVerticalIcon from '@heroicons/react/24/solid/AdjustmentsVerticalIcon';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  SvgIcon,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Collapse,
  TextField,
  MenuItem
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Message from 'src/components/Miscellaneous/Message';
const axios = require('axios');
export const Row = (props) => {
  const { row: patient ,index:index} = props;
  const [open, setOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onRemovePatient = async (username) => {
    try {
      const removeResponse = await axios.delete('http://localhost:8000/admin/removePatient', { // done new Route
        data: { Username: username }
      });
    } catch (error) {
      console.error('Error removing Pharmacist:', error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
    }
  };
  const router = useRouter();
  const handleRemoveClick = async () => {
    try {
      await onRemovePatient(patient.Username);
    } catch (error) {
      console.error('Error removing Pharmacist:', error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
    }
    router.refresh();
  };

  return (
    <Fragment>
      <Message condition={showError} setCondition={setShowError} message={errorMessage} title="Error" buttonAction="Close" />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="normal">
          <IconButton
            children={(
              <SvgIcon>
                {!open ? <ChevronRightIcon/> : <ChevronDownIcon/>}
              </SvgIcon>
            )}
            color="primary"
            onClick={() => {
              setOpen(!open);
            }}
          >
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="h7">
            {patient.FirstName} {patient.LastName}
          </Typography>
        </TableCell>
        <TableCell>
          {patient.Username}
        </TableCell>
        <TableCell>
          {patient.Email}
        </TableCell>
        <TableCell>
          {patient.Gender}
        </TableCell>
        <TableCell>
          {patient.Number}
        </TableCell>
        {/* <TableCell>
         <Tooltip title="Edit Medicine">
         <IconButton
         children ={(
         <SvgIcon fontSize="small">
         <PencilIcon />
         </SvgIcon>
         )}
         color="primary"
         onClick={() => {
         // const encodedData = encodeURIComponent(JSON.stringify(patient));
         // router.push(`/pharmacist/editMedicine?data=${encodedData}`);
         }}
         >
         </IconButton >
         </Tooltip>
         </TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Patient Details
              </Typography>
              <Stack direction="row" spacing={10} sx={{ mt: 3 }}>
                <Avatar
                  src={`/assets/avatars/${index}.png`}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '100%'
                  }}
                >
                  {getInitials(patient.name)}
                </Avatar>
                <Stack spacing={2}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      // error = {!!(formik.touched.name && formik.errors.name)}
                      fullWidth
                      // helperText={formik.touched.name && formik.errors.name}
                      label="National ID"
                      name="name"
                      // onBlur={formik.handleBlur}
                      // onChange={formik.handleChange}
                      value={patient.NationalID}
                    />
                    <TextField
                      // error = {!!(formik.touched.activeIngredient && formik.errors.activeIngredient)}
                      fullWidth
                      // helperText={formik.touched.activeIngredient && formik.errors.activeIngredient}
                      label="Date of Birth"
                      name="activeIngredient"
                      // onBlur={formik.handleBlur}
                      // onChange={formik.handleChange}
                      value={patient.DateOfBirth}
                      type="date"
                    />
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <Typography variant="h6" sx={{ mt: 2, width: 800 }}>
                      Emergency Contact
                    </Typography>
                    <TextField
                      // error = {!!(formik.touched.price && formik.errors.price)}
                      fullWidth
                      // helperText={formik.touched.price && formik.errors.price}
                      label="Name"
                      name="price"
                      // onBlur={formik.handleBlur}
                      // onChange={formik.handleChange}
                      value={patient.EmergencyContact.Name}
                    />
                    <TextField
                      // error = {!!(formik.touched.availableQuantity && formik.errors.availableQuantity)}
                      fullWidth
                      // helperText={formik.touched.availableQuantity && formik.errors.availableQuantity}
                      label="Phone Number"
                      name="availableQuantity"
                      // onBlur={formik.handleBlur}
                      // onChange={formik.handleChange}
                      value={patient.EmergencyContact.Number}
                    />
                    <TextField
                      // error = {!!(formik.touched.medicalUse && formik.errors.medicalUse)}
                      fullWidth
                      // helperText={formik.touched.medicalUse && formik.errors.medicalUse}
                      label="Relation"
                      name="medicalUse"
                      // onBlur={formik.handleBlur}
                      // onChange={formik.handleChange}
                      value={patient.EmergencyContact.Relation}
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Stack spacing={2} direction="row" sx={{ mt: 3 }}>
                <Button
                  size="large"
                  sx={{ height: 40, backgroundColor: 'error.main' }}
                  type="submit"
                  variant="contained"
                  onClick={handleRemoveClick}
                >
                  Remove
                </Button>
                <Button
                  size="large"
                  sx={{ height: 40, backgroundColor: 'success.main', mt: 'auto' }}
                  variant="contained"
                  type="submit"
                  onClick={() => {setOpen(!open);}}
                >
                  Done
                </Button>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};