import { Stack, Typography } from "@mui/material";

function Header({ name, actions }) {
  return (
    <Stack direction="column" justifyContent="space-between" spacing={4}>
      <Stack spacing={1}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {name}
          {actions}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default Header;
