import { Snackbar, Alert } from "@mui/material";
function BottomMessage({ condition, onClose, message, severity }) {
  return (
    <Snackbar
      open={condition}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert severity={severity} sx={{ width: "100%", textAlign: "center" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
export default BottomMessage;
