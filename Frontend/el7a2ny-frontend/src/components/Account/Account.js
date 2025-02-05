import { Grid } from "@mui/material";
import AccountCard from "./AccountCard";
import AccountDetails from "./AccountDetails";
function Account({ user }) {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={6} lg={4}>
        <AccountCard user={user} />
      </Grid>
      <Grid xs={12} md={6} lg={8}>
        <AccountDetails user={user} />
      </Grid>
    </Grid>
  );
}

export default Account;
