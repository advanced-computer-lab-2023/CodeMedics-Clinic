import { Card, CardHeader, CardContent, Stack, TextField } from "@mui/material";
function HealthPackage({ user }) {
  return (
    <Card>
      <CardHeader title="My Health Package" />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={3}>
          <Stack xs={12} md={6} direction="row" spacing={3}>
            <TextField
              fullWidth
              label="Health Package Name"
              disabled
              name="HealthPackageName"
              value={user.HealthPackage.membership}
            />
            <TextField
              fullWidth
              label="Health Package Expiration Date"
              disabled
              name="HealthPackageExpirationDate"
              value={
                user.HealthPackage.date == null
                  ? "No Expiration"
                  : new Date(user.HealthPackage.date).toDateString()
              }
            />
          </Stack>
          <Stack xs={12} md={6} direction="row" spacing={3}>
            <TextField
              fullWidth
              label="Health Package Status"
              disabled
              name="HealthPackagePrice"
              value={
                user.HealthPackage.status == "EndDateCancelled"
                  ? "Cancelled with end date"
                  : user.HealthPackage.status == "Inactive"
                  ? "Free Package Active"
                  : "Active"
              }
            />
            <TextField
              fullWidth
              label="Health Package Type"
              disabled
              name="EmergencyContactName"
              value={user.HealthPackage.status == "main" ? "Main" : "Family"}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
export default HealthPackage;
