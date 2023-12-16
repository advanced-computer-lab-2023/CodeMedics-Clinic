import { Avatar, Box, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography, Divider } from '@mui/material';

export const ChatItemPhamracy = (props) => {

    const { chat, index, selectedChat, setSelectedChat, username, getMessages } = props;
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
                ...(selectedChat && selectedChat.pharmacy && selectedChat.chat._id === chat._id && {
                    backgroundColor: 'action.hover'
                })
            }}
        >
            <div>
            <Avatar alt={"Code Medics Pharmacy"} src={`/assets/Pharmacy-Logo.png`}/>
            </div>
            <Box sx={{flexGrow: 1,overflow: 'hidden'}}>
                <Typography variant='subtitle2' noWrap>
                   Code Medics Pharmacy
                </Typography>
                {chat.latestMessage && 
                <Typography color="text.secondary" noWrap sx={{ flexGrow: 1 }} variant="subtitle2">
                    {chat.latestMessage.sender == username ? "Me: " : ""} {chat.latestMessage.content}
                </Typography>}
            </Box>

        </Stack>
    );
};