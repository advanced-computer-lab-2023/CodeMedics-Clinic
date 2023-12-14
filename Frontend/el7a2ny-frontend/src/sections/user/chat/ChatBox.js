import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import PaperAirplaneIcon from '@heroicons/react/24/solid/PaperAirplaneIcon';
import { Stack, Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';

export const ChatBox = (props) => {
    const { selectedChat, messages } = props;

    return (
        <Stack>
            <Stack sx={{ m: 2 }} direction="row" justifyContent="space-between">
                <Stack direction="row" >
                <Avatar alt={selectedChat.doctor.FirstName + " " + selectedChat.doctor.LastName} src={selectedChat.doctor.Picture == null ? `/assets/avatars/0.png` : selectedChat.doctor.Picture} />
                <Stack sx={{ ml: 2, mt: 0.5}} >
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
            <Divider flexItem/>
            <Box sx={{ height: 495, overflow: 'auto' }} >
                {messages && messages.map((message, index) => {
                    return (
                        <Stack direction="row" >
                            <Avatar alt={selectedChat.doctor.FirstName + " " + selectedChat.doctor.LastName} src={selectedChat.doctor.Picture == null ? `/assets/avatars/0.png` : selectedChat.doctor.Picture} />
                            <Stack sx={{ ml: 2, mt: 0.5, width: 650 }}>
                                <Typography variant='body1' >
                                    {selectedChat.doctor.FirstName + " " + selectedChat.doctor.LastName}
                                </Typography>
                                <Typography variant='caption' color="textSecondary">
                                    {message}
                                </Typography>
                            </Stack>
                        </Stack>
                    )
                })
                }
            </Box>
            <Divider sx={{ width: 785 }} />
            <Stack sx={{ ml: 2, mt: 1 }} direction="row">
                <Avatar alt={selectedChat.user.FirstName + " " + selectedChat.user.LastName} src={selectedChat.user.Picture == null ? `/assets/avatars/2.png` : selectedChat.user.Picture} />
                <OutlinedInput
                    defaultValue=""
                    sx={{ ml: 2, height: 40, width: 580, mr: 5 }}
                    onChange={(str) => {
                    }}
                    placeholder="Leave a message"
                />
                <Tooltip title="Send">
                    <IconButton >
                        <SvgIcon
                            color="action"
                            fontSize="small"
                        >
                            <PaperAirplaneIcon />
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Stack>
    );
};