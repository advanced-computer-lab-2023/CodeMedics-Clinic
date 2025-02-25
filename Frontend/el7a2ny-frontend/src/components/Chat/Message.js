import { Stack, Box, Typography, Card } from "@mui/material";

export const Message = (props) => {
  const { message, position = "right" } = props; // Default position to "right"

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes} ${period}`;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: position === "right" ? "flex-end" : "flex-start",
        justifyContent: "flex-end", // Align messages to the right by default
        my: 0.5, // Reduce spacing between messages
      }}
    >
      <Stack
        direction={position === "right" ? "row-reverse" : "row"}
        spacing={1}
        sx={{
          maxWidth: "60%",
          ml: position === "right" ? "auto" : 0,
          mr: position === "left" ? "auto" : 0,
        }}
      >
        <Box>
          <Card
            sx={{
              backgroundColor: position === "right" ? "#DCF8C6" : "#FFFFFF",
              color: "text.primary",
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="body2">{message.content}</Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "right",
                mt: 0.5,
                fontSize: "0.75rem",
                color: "text.secondary",
              }}
            >
              {formatTimestamp(message.createdAt)}
            </Typography>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};
