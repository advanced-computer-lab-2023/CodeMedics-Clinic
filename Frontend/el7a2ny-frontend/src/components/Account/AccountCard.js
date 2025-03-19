import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

function AccountCard({ src, texts }) {
  const textsElements = texts.map(text => (
    <Typography gutterBottom variant={text.variant} color={text.color}>
      {text.value}
    </Typography>
  ))
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Avatar
            src={src}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          {textsElements}
        </Box>
      </CardContent>
    </Card>
  );
}

export default AccountCard