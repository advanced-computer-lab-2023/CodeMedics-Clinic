import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useState } from 'react';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import Cookies from 'js-cookie';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const buttons = ["El7a2ny Virtual Clinic", "El7a2ny Virtual Pharmacy"];
  const type = Cookies.get("type");
  const handleMenuItemClick = (item) => {
    if (item === "El7a2ny Virtual Clinic") {
      if (type == 'patient') {
        window.location.href = "http://localhost:3000/user/doctors";
      }
      if(type == 'admin'){
        window.location.href = "http://localhost:3000/admin/admins";
      }
      if(type == 'pharmacist'){
        window.location.href = "http://localhost:3000/";
      }
      if(type == 'doctor'){
        window.location.href = "http://localhost:3000/doctor/patients";
      }
    }
    else {
      if (type == 'patient') {
        window.location.href = "http://localhost:3001/user/medicines";
      }
      if(type == 'admin'){
        window.location.href = "http://localhost:3001/admin";
      }
      if(type == 'pharmacist'){
        window.location.href = "http://localhost:3001/pharmacist/performance";
      }
      if(type == 'doctor'){
        window.location.href = "http://localhost:3001/";
      }
      
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <Logo />
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              p: '12px'
            }}
          >
            <div>
              <Typography
                color="inherit"
                variant="subtitle1"
              >
                El7a2ny
              </Typography>
              <Typography
                color="neutral.400"
                variant="body2"
              >
                Virtual Clinic
              </Typography>
            </div>

            {(
              <div>
                <Tooltip title="Websites">
                  <IconButton
                    onClick={handleIconClick}
                    children={(
                      // <SvgIcon fontSize="small">
                      //   <EllipsisVerticalIcon />
                      // </SvgIcon>
                      <SvgIcon
                        fontSize="small"
                        sx={{ color: 'neutral.500' }}
                      >
                        <ChevronUpDownIcon />
                      </SvgIcon>
                    )}
                    color="primary"
                  />
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button'
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    horizontal: 'center',
                  }}
                  getContentAnchorEl={null}
                >
                  {buttons.map((item) => (
                    <MenuItem onClick={() => handleMenuItemClick(item)} key={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
