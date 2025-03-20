import { Stack, Box, Divider } from "@mui/material";
import { ChatBoxTop } from "./ChatBoxTop";
import { ChatMessages } from "./ChatMessages";
import { Scrollbar } from "src/components/Scrollbar";
import { NewChatMessage } from "./NewChatMessage";

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
      <NewChatMessage selectedChat={selectedChat} onSend={sendMessage} />
    </Stack>
  );
};
