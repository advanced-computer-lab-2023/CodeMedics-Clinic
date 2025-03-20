import { Box, Stack, Typography } from "@mui/material";
import { ChatSidebarSearch } from "./ChatSidebarSearch";
import { Scrollbar } from "src/components/Scrollbar";
import { ChatItem } from "./ChatItem";
import NoRecords from "../NoRecords";

export const ChatSidebar = (props) => {
  const { chats, selectedChat, setSelectedChat, searchName, setSearchName } = props;

  const chatElements = chats.map((chat, index) => {
    console.log(chat, chat.doctor || chat.patient || chat.pharmacy);
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
      <ChatSidebarSearch searchName={searchName} setSearchName={setSearchName} />
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
            {chats.length == 0 ? <NoRecords message={"No Chats Found"} /> : chatElements}
          </Stack>
        </Scrollbar>
      </Box>
    </div>
  );
};
