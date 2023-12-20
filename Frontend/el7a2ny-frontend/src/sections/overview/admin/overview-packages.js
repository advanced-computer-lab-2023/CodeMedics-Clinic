import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import Cookies from 'js-cookie';
import axios from 'axios';
import Message from 'src/components/Message';
import {
  Alert, Backdrop,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, TextField
} from '@mui/material';
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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DocumentArrowUpIcon from '@heroicons/react/24/solid/DocumentArrowUpIcon';

export const OverviewPackages = (props) => {

  const router = useRouter();
  const { initialPackages = [], isAddOpen, setIsAddOpen, setShowErrorAlert } = props;
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addAlert, setAddAlert] = useState('');
  const [packages, setPackages] = useState([]);
  const [DeleteAlert, setDeleteAlert] = useState({});
  const [UpdateAlert, setUpdateAlert] = useState('');

  useEffect(() => {
    // Check if packages state is empty before updating it
    if (packages.length === 0) {
      setPackages(initialPackages);
    }
  }, [initialPackages, packages]);

  const formik = useFormik({
    initialValues: {
      Name: '',
      Price: '',
      SessionDiscount: '',
      MedicineDiscount: '',
      FamilyDiscount: ''
    },
    validationSchema: Yup.object({
      Name: Yup.string().max(255).required('Name is required'),
      Price: Yup.number().required('Price is required'),
      SessionDiscount: Yup.number().required('Session Discount is required'),
      MedicineDiscount: Yup.number().required('Medicine Discount is required'),
      FamilyDiscount: Yup.number().required('Family Discount is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {
          'Name': values.Name,
          'Price': values.Price,
          'SessionDiscount': values.SessionDiscount,
          'MedicineDiscount': values.MedicineDiscount,
          'FamilyDiscount': values.FamilyDiscount
        };
        await axios.post('http://localhost:8000/admin/addPackage', body)
                   .then((res) => {
                     const newPackage = res.data.package;
                     setPackages((prevPackages) => [...prevPackages, newPackage]);
                     setShowErrorAlert(true);
                     setDialogOpen(false);
                     setIsAddOpen(false);
                     setShowErrorAlert(res.data.message);
                     handleDialogClose();
                   });
      } catch (err) {
        setAddAlert(err.response.data.message);
        helpers.setStatus({ success: false });
        helpers.setErrors({ Submit: err.response.data.message });
        helpers.setSubmitting(false);
      }
    }
  });
  const formikUpdate = useFormik({
    initialValues: {
      Name: '',
      Price: '',
      SessionDiscount: '',
      MedicineDiscount: '',
      FamilyDiscount: ''
    },
    validationSchema: Yup.object({
      Name: Yup.string(),
      Price: Yup.number(),
      SessionDiscount: Yup.number(),
      MedicineDiscount: Yup.number(),
      FamilyDiscount: Yup.number()
    }),
    onSubmit: async (values, helpers) => {
    }
  });
  const handleUpdatePackage = async (req) => {
    try {
      const body = {
        'Name': req.Name,
        'Price': req.Price,
        'SessionDiscount': req.SessionDiscount,
        'MedicineDiscount': req.MedicineDiscount,
        'FamilyDiscount': req.FamilyDiscount
      };
      await axios.patch('http://localhost:8000/admin/updatePackage', body)
                 .then((res) => {
                   const newPackage = res.data.updatedPackage;
                   setPackages((prevPackages) => {
                     const updatedPackages = prevPackages.map((myPackage) =>
                       myPackage.Name === newPackage.Name ? newPackage : myPackage
                     );

                     return updatedPackages;
                   });
                   setShowErrorAlert(true);
                   setShowErrorAlert(res.data.message);
                   formikUpdate.resetForm();
                   setAddAlert('');
                   setUpdateAlert('');

                 });
    } catch (err) {
      setAddAlert(err.response.data.message);
      console.log(err);
    }
  };

  const handleDeletePackage = async (packageName) => {
    try {
      const response = await axios.delete('http://localhost:8000/admin/removePackage', {
        data: {
          Name: packageName
        }
      });
      setPackages((prevPackages) => prevPackages.filter((myPackage) => myPackage.Name
        !== packageName));
      setShowErrorAlert(response.data);
      setDeleteAlert((prev) => ({ ...prev, [packageName]: false }));
    } catch (error) {
      console.error(error);
      setShowError(true);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    }
  };//Name required
  const handleDialogClose = () => {
    formik.resetForm();
    setAddAlert('');
    setDialogOpen(false);
  };
  const handleUpdateDialogClose = () => {
    formikUpdate.resetForm();
    setAddAlert('');
    setUpdateAlert('');
  };

  useEffect(() => {
    // Open the dialog when isAddOpen is true
    if (isAddOpen) {
      setDialogOpen(true);
      // Optionally, you can reset isAddOpen after opening the dialog
      setIsAddOpen(false);
    }
  }, [isAddOpen]);
  return (
    <CardContent>
      <Message condition={showError} setCondition={setShowError} title={'Error'}
               message={errorMessage} buttonAction={'Close'}/>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={2}
      >
        {packages.map((myPackage, index) => {
          return (
            <Card
              key={myPackage.Name}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                textAlign: 'center',
                alignItems: 'center'
              }}
            >
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  textAlign: 'center'

                }}
              >
                <ListItemAvatar>
                  {myPackage.Picture ? (
                    <Box
                      component="img"
                      src={doctor.Picture}
                      sx={{
                        borderRadius: '70%',
                        height: 130,
                        width: 130,
                        objectFit: 'cover',
                        margin: '0 auto'
                      }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={`/assets/Packages/${myPackage.Name}.jpg`}
                      sx={{
                        borderRadius: '50%',
                        backgroundColor: 'neutral.200',
                        height: 120,
                        width: 120,
                        mb: 3
                      }}
                    />
                  )}
                </ListItemAvatar>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Typography
                    color="text.secondary"
                    sx={{
                      alignSelf: 'flex-end',
                      ml: 1
                    }}
                    variant="subtitle2"
                  >
                    {myPackage.Price} /year
                  </Typography>
                </Box>

                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.Name + ' Package'}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.SessionDiscount + '% Session Discount'}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.MedicineDiscount + '% Medicine Discount'}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.FamilyDiscount + '% Family Discount'}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>

              <Stack direction="row">
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button variant="contained" onClick={() => {
                    setUpdateAlert((prev) => ({ ...prev, [myPackage.Name]: true }));
                  }}>
                    Edit
                  </Button>
                  <Button variant="contained" onClick={() => setDeleteAlert((prev) => ({
                    ...prev,
                    [myPackage.Name]: true
                  }))}>
                    Delete
                  </Button>
                </CardActions>


                <Dialog open={UpdateAlert[myPackage.Name]} onClose={() => {
                  handleUpdateDialogClose();
                }}>
                  <form noValidate onSubmit={(e) => {
                    e.preventDefault(); // Prevent the default form submission
                    handleUpdatePackage({
                      Name: myPackage.Name,
                      Price: formikUpdate.values.Price,
                      SessionDiscount: formikUpdate.values.SessionDiscount,
                      MedicineDiscount: formikUpdate.values.MedicineDiscount,
                      FamilyDiscount: formikUpdate.values.FamilyDiscount
                    });

                  }}>
                    <DialogTitle>Edit Package</DialogTitle>
                    <DialogContent>
                      {addAlert && (
                        <Alert severity="error">{addAlert}</Alert>
                      )}
                      <Stack spacing={3}>
                        <TextField
                          error={!!(formikUpdate.touched.Name && formikUpdate.errors.Name)}
                          fullWidth
                          helperText={formikUpdate.touched.Name && formikUpdate.errors.Name}
                          label="Name"
                          name="Name"
                          onBlur={formikUpdate.handleBlur}
                          onChange={formikUpdate.handleChange}
                          value={myPackage.Name}
                          disabled
                        />
                        <TextField
                          error={!!(formikUpdate.touched.Price && formikUpdate.errors.Price)}
                          fullWidth
                          helperText={formikUpdate.touched.Price && formikUpdate.errors.Price}
                          label="Price"
                          name="Price"
                          onBlur={formikUpdate.handleBlur}
                          onChange={formikUpdate.handleChange}
                          value={formikUpdate.values.Price}
                        />
                        <TextField
                          error={!!(formikUpdate.touched.SessionDiscount
                            && formikUpdate.errors.SessionDiscount)}
                          fullWidth
                          helperText={formikUpdate.touched.SessionDiscount
                            && formikUpdate.errors.SessionDiscount}
                          label="Session Discount"
                          name="SessionDiscount"
                          onBlur={formikUpdate.handleBlur}
                          onChange={formikUpdate.handleChange}
                          value={formikUpdate.values.SessionDiscount}
                        />
                        <TextField
                          error={!!(formikUpdate.touched.MedicineDiscount
                            && formikUpdate.errors.MedicineDiscount)}
                          fullWidth
                          helperText={formikUpdate.touched.MedicineDiscount
                            && formikUpdate.errors.MedicineDiscount}
                          label="Medicine Discount"
                          name="MedicineDiscount"
                          onBlur={formikUpdate.handleBlur}
                          onChange={formikUpdate.handleChange}
                          value={formikUpdate.values.MedicineDiscount}
                        />
                        <TextField
                          error={!!(formikUpdate.touched.FamilyDiscount
                            && formikUpdate.errors.FamilyDiscount)}
                          fullWidth
                          helperText={formikUpdate.touched.FamilyDiscount
                            && formikUpdate.errors.FamilyDiscount}
                          label="Family Discount"
                          name="FamilyDiscount"
                          onBlur={formikUpdate.handleBlur}
                          onChange={formikUpdate.handleChange}
                          value={formikUpdate.values.FamilyDiscount}
                        />
                      </Stack>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => {
                        handleUpdateDialogClose();
                      }}>Cancel</Button>
                      <Button type="submit" color="primary">Save
                        Changes</Button>
                    </DialogActions>
                  </form>
                </Dialog>


                <Dialog open={DeleteAlert[myPackage.Name]}
                        onClose={() => setDeleteAlert((prev) => ({
                          ...prev,
                          [myPackage.Name]: false
                        }))}>
                  <DialogTitle>Are you sure you want to delete this package?</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      You will not be able to undo this action.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDeleteAlert((prev) => ({
                      ...prev,
                      [myPackage.Name]: false
                    }))}>Cancel</Button>
                    <Button onClick={() => handleDeletePackage(myPackage.Name)}>Delete</Button>
                  </DialogActions>
                </Dialog>
              </Stack>
            </Card>
          );
        })}
      </Box>
      <Backdrop
        sx={{
          backdropFilter: 'blur(5px)', // Adjust the blur radius as needed
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={dialogOpen}
        onClick={handleDialogClose}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Package</DialogTitle>
          <DialogContent>
            {addAlert && (
              <Alert severity="error">{addAlert}</Alert>
            )}
            <Stack spacing={3}>
              <TextField
                error={!!(formik.touched.Name && formik.errors.Name)}
                fullWidth
                helperText={formik.touched.Name && formik.errors.Name}
                label="Package Name"
                name="Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Name}
              />
              <TextField
                error={!!(formik.touched.Price && formik.errors.Price)}
                fullWidth
                helperText={formik.touched.Price && formik.errors.Price}
                label="Price"
                name="Price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Price}
              />
              <TextField
                error={!!(formik.touched.SessionDiscount && formik.errors.SessionDiscount)}
                fullWidth
                helperText={formik.touched.SessionDiscount && formik.errors.SessionDiscount}
                label="Session Discount (only the amount)"
                name="SessionDiscount"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.SessionDiscount}
              />
              <TextField
                error={!!(formik.touched.MedicineDiscount && formik.errors.MedicineDiscount)}
                fullWidth
                helperText={formik.touched.MedicineDiscount && formik.errors.MedicineDiscount}
                label="Medicine Discount (only the amount)"
                name="MedicineDiscount"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.MedicineDiscount}
              />
              <TextField
                error={!!(formik.touched.FamilyDiscount && formik.errors.FamilyDiscount)}
                fullWidth
                helperText={formik.touched.FamilyDiscount && formik.errors.FamilyDiscount}
                label="Family Discount (only the amount)"
                name="FamilyDiscount"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.FamilyDiscount}
              />
            </Stack>
            <DialogContentText>
              Please add the details for the new package.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>


    </CardContent>
  );
};
OverviewPackages.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
  isAddOpen: PropTypes.bool,
  setIsAddOpen: PropTypes.func,
  setShowErrorAlert: PropTypes.func
};
