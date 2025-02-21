import { Stack, Typography, Avatar } from "@mui/material";
function NoChat() {
  return (
    <Stack>
      <Avatar
        src={`/assets/errors/error-404.png`}
        sx={{ height: 140, width: 140, p: 2, mt: 25, ml: 39 }}
      />
      <Typography variant="subtitle2" sx={{ mb: 4, ml: 33, fontSize: 16 }}>
        Start meaningful conversations!
      </Typography>
    </Stack>
  );
}

export default NoChat;
