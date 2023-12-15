import { Stack, Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';

export const Message = (props) => {
    const { message , position } = props;
    return (
        <Box
      sx={{
        m: 2,
        display: 'flex',
        alignItems: position === 'right' ? 'flex-end' : 'flex-start'
      }}
      >
      <Stack
        alignItems="flex-start"
        direction={position === 'right' ? 'row-reverse' : 'row'}
        spacing={2}
        sx={{
          maxWidth: 500,
          ml: position === 'right' ? 'auto' : 0,
          mr: position === 'left' ? 'auto' : 0
        }}
      >
        {/* <Avatar
          src={authorAvatar || undefined}
          sx={{
            height: 32,
            width: 32
          }}
        /> */}
        <Box sx={{ flexGrow: 1 }}>
          <Card
            sx={{
              backgroundColor: position === 'right' ? 'primary.main' : 'background.paper',
              color: position === 'right' ? 'primary.contrastText' : 'text.primary',
              px: 2,
              py: 1
            }}
          >
            
              <Typography
                color="inherit"
                variant="body1"
              >
                {message}
              </Typography>
            
          </Card>
          <Box
            sx={{
              display: 'flex',
              justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
              mt: 1,
              px: 2
            }}
          >
          </Box>
        </Box>
      </Stack>
    </Box>
    );
};