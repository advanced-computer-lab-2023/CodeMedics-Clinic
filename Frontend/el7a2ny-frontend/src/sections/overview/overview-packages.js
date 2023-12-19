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

export const OverviewPackages = (props) => {

  const router = useRouter();
  const { packages = [], me } = props;

  const subscribeHealthPackage = (curPackage) => {
    router.push('/user/PackageMyPay?packageName=' + curPackage.Name + '&packagePrice=' + curPackage.Price);
  }

  const unsubscribeHealthPackage = () => {
    axios(`http://localhost:8000/patient/unsubscribeHealthPackage`, {
      method: 'POST',
      withCredentials: true
    })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CardContent>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={2}
      >
        {packages.map((myPackage, index) => {
          return (
            <Card
              key={myPackage._id}
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
                  {myPackage.Picture ? (
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
                      src={`/assets/Packages/${myPackage.Name}.jpg`}
                      sx={{
                        borderRadius: '50%',
                        backgroundColor: 'neutral.200',
                        height: 120,
                        width: 120,
                        mb:3
                      }}
                    />
                  )}
                </ListItemAvatar>
                <Box sx={{ display: 'flex',mb:1 }}>
                  <Typography variant="h5">
                    {Object.keys(me).length !== 0 && (myPackage.Price * (1 - me.HealthPackage.discount)) + ' EGP'}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      alignSelf: 'flex-end',
                      ml: 1
                    }}
                    variant="subtitle2"
                  >
                    /year
                  </Typography>
                </Box>
                
                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.Name + " Package"}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.SessionDiscount + "% Session Discount"}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.MedicineDiscount + "% Medicine Discount"}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <ListItemText
                  sx={{ alignSelf: 'flex-start', ml: 4 }}
                  primary={myPackage.FamilyDiscount + "% Family Discount"}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>

              <Stack direction="row">
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {(Object.keys(me).length !== 0 && me.HealthPackage.status === 'EndDateCancelled' || Object.keys(me).length !== 0 && me.HealthPackage.membership !== myPackage.Name && me.HealthPackage.membership !== "Free") ?
                    <Button variant="contained" disabled>
                      Subscribe
                    </Button>
                    : Object.keys(me).length !== 0 && me.HealthPackage.status === 'Inactive' ?
                      <Button variant="contained" onClick={() => subscribeHealthPackage(myPackage)}>
                        Subscribe
                      </Button> :
                      <Button variant="contained" onClick={unsubscribeHealthPackage}>
                        Unsubscribe
                      </Button>}
                </CardActions>
              </Stack>
            </Card>
          );
        })}
      </Box>
    </CardContent>
  );
};

OverviewPackages.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
