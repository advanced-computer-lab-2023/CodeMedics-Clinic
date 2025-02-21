import { Box, Stack, Typography } from "@mui/material";
import { ChatSidebarSearch } from "./ChatSidebarSearch";
import { Scrollbar } from "src/components/scrollbar";
import { ChatItem } from "./ChatItem";

export const ChatSidebar = (props) => {
  const { chats, selectedChat, setSelectedChat } = props;

  const chatElements = chats.map((chat, index) => {
    console.log(chat, chat.doctor || chat.patient || chat.pharmacy)
    return (
      <ChatItem
        key={index}
        index={index}
        chat={chat}
        obj={chat.doctor || chat.pharmacy || chat.patient}
        isPharmacy={chat.pharmacy ? true : false}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
    );
  });

  return (
    <div>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2, width: 350 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Chats
        </Typography>
      </Stack>
      <ChatSidebarSearch />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          height: 485,
        }}
      >
        <Scrollbar sx={{ maxHeight: "100%" }}>
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              m: 0,
              p: 2,
            }}
          >
            {chatElements}
          </Stack>
        </Scrollbar>
      </Box>
    </div>
  );
};
