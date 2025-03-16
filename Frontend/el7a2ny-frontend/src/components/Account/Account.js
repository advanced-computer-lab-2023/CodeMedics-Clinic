import { Grid } from "@mui/material";
import AccountCard from "./AccountCard";
import AccountDetails from "./AccountDetails";
function Account({ user, fields, setError, setShowError }) {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={6} lg={4} sx={{ px: 2 }}>
        <AccountCard
          src={user.avatar}
          texts={[
            { value: user.username, variant: "h5" },
            { value: `${user.wallet} EGP`, variant: "h5", color: "green" },
          ]}
        />
      </Grid>
      <Grid xs={12} md={6} lg={8}>
        <AccountDetails
          user={user}
          fields={fields}
          setError={setError}
          setShowError={setShowError}
        />
      </Grid>
    </Grid>
  );
}

export default Account;
