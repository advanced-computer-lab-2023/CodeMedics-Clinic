import { Avatar, Box, Card, CardContent, Divider, Typography } from "@mui/material";

function AccountCard({ user }) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {user.FirstName}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography gutterBottom variant="h5" color="green">
            {user.Wallet} EGP
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AccountCard