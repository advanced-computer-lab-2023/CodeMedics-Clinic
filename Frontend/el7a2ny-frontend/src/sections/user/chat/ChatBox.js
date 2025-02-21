import { Stack, Box, Divider } from "@mui/material";
import { ChatBoxTop } from "./ChatBox-top";
import { ChatMessages } from "./ChatMessages";
import { Scrollbar } from "src/components/scrollbar";
import { ChatMessageAdd } from "./ChatMessageAdd";

export const ChatBox = (props) => {
  const { selectedChat, messages, sendMessage } = props;
  return (
    <Stack sx={{ flexGrow: 1 }}>
      <ChatBoxTop
        selectedChat={selectedChat}
        isPharmacy={selectedChat.pharmacy ? true : false}
        user={selectedChat.doctor ? "doctor" : "patient"}
      />
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          height: 445,
        }}
      >
        <Scrollbar sx={{ maxHeight: "100%" }}>
          <ChatMessages messages={messages} />
        </Scrollbar>
      </Box>
      <Divider />
      <ChatMessageAdd selectedChat={selectedChat} onSend={sendMessage} />
    </Stack>
  );
};
