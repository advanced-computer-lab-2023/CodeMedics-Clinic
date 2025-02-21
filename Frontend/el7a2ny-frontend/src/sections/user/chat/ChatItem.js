import { Avatar, Box, Stack, Typography } from "@mui/material";
import Cookies from "js-cookie";

export const ChatItem = (props) => {
  const { chat, obj, isPharmacy, index, selectedChat, setSelectedChat } = props;
  const username = Cookies.get("username");
  const name = isPharmacy ? "Code Medics Pharmacy" : `${obj.firstName} ${obj.lastName}`;

  return (
    <Stack
      component="li"
      direction="row"
      onClick={() => {
        setSelectedChat(chat);
      }}
      spacing={2}
      sx={{
        borderRadius: 2.5,
        cursor: "pointer",
        px: 3,
        py: 2,
        "&:hover": {
          backgroundColor: "action.hover",
        },
        ...(selectedChat &&
          selectedChat.chat._id === chat._id && {
            backgroundColor: "action.hover",
          }),
      }}
    >
      <div>
        <Avatar
          alt={name}
          src={
            isPharmacy
              ? `/assets/Pharmacy-Logo.png`
              : obj.picture == null
              ? `/assets/avatars/${index % 16}.png`
              : obj.picture
          }
        />
      </div>
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
        {chat.latestMessage && (
          <Typography color="text.secondary" noWrap sx={{ flexGrow: 1 }} variant="subtitle2">
            {chat.latestMessage.sender == username ? "You: " : ""} {chat.latestMessage.content}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};
