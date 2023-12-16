import { Avatar, Box, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography, Divider } from '@mui/material';

export const ChatItem = (props) => {

    const { chat, doctor, index, selectedChat, setSelectedChat, username, getMessages } = props;
    return (
        <Stack
            component="li"
            direction="row"
            onClick={() => { setSelectedChat(chat); getMessages(chat.chat._id); }}
            spacing={2}
            sx={{
                borderRadius: 2.5,
                cursor: 'pointer',
                px: 3,
                py: 2,
                '&:hover': {
                    backgroundColor: 'action.hover'
                },
                ...(selectedChat && !selectedChat.pharmacy && selectedChat.doctor.Username === doctor.Username && {
                    backgroundColor: 'action.hover'
                })
            }}
        >
            <div>
            <Avatar alt={doctor.FirstName + " " + doctor.LastName} src={doctor.Picture == null ? `/assets/avatars/${index % 16}.png` : doctor.Picture} />
            </div>
            <Box sx={{flexGrow: 1,overflow: 'hidden'}}>
                <Typography variant='subtitle2' noWrap>
                    {doctor.FirstName + " " + doctor.LastName}
                </Typography>
                {chat.latestMessage && 
                <Typography color="text.secondary" noWrap sx={{ flexGrow: 1 }} variant="subtitle2">
                    {chat.latestMessage.sender == username ? "You: " : ""} {chat.latestMessage.content}
                </Typography>}
            </Box>

        </Stack>
    );
};