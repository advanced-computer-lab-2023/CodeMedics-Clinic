import { TextField } from "@mui/material";

function TextInput({ option, setValue, defaultValue, type, disabled }) {
  return (
    <TextField
      label={option}
      fullWidth
      defaultValue={defaultValue}
      type={type}
      disabled={disabled}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      sx={{ borderRadius: 4 }}
      InputLabelProps={{ shrink: true }}
    />
  );
}

export default TextInput;
