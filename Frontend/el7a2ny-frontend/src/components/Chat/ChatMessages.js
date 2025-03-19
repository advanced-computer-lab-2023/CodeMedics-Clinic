import { Stack } from "@mui/material";
import { Message } from "./Message";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

export const ChatMessages = (props) => {
  const { messages } = props;
  const ref = useRef(null);
  const username = Cookies.get("username");

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <div>
      <Stack spacing={2} sx={{ p: 3 }}>
        {messages.map((message, index) => {
          return (
            <Message message={message} position={message.sender == username ? "right" : "left"} />
          );
        })}
      </Stack>
      <div ref={ref} />
    </div>
  );
};
