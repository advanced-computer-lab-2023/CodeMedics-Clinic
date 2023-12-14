import { Stack, Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';

export const ChatBoxTop = (props) => {
    const { selectedChat } = props;
    return(
        <Stack sx={{ m: 2 }} direction="row" justifyContent="space-between">
                <Stack direction="row" >
                    <Avatar alt={selectedChat.doctor.FirstName + " " + selectedChat.doctor.LastName} src={selectedChat.doctor.Picture == null ? `/assets/avatars/0.png` : selectedChat.doctor.Picture} />
                    <Stack sx={{ ml: 2, mt: 0.5 }} >
                        <Typography variant='body1' >
                            {selectedChat.doctor.FirstName + " " + selectedChat.doctor.LastName}
                        </Typography>
                        <Typography variant='caption' color="textSecondary">
                            {selectedChat.doctor.Speciality}
                        </Typography>
                    </Stack>
                </Stack>
                <Tooltip title="Video Call">
                    <IconButton >
                        <SvgIcon
                            color="action"
                            fontSize="small"
                        >
                            <CameraIcon />
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
            </Stack>
    );
};