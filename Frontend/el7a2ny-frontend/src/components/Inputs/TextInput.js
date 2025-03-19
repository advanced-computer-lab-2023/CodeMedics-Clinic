import { TextField } from "@mui/material";

function TextInput({ option, setValue, defaultValue, type, disabled, addMargin }) {
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
      sx={{ marginBottom: addMargin ? 2 : null, borderRadius: 4, marginTop: addMargin ? 2 : null }}
      InputLabelProps={{ shrink: true }}
    />
  );
}

export default TextInput;
