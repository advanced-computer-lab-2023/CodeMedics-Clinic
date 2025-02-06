import { TextField } from "@mui/material";

function DateInput({ option, setValue, defaultValue }) {
  const handleChange = (event) => {
    const value = event.target.value;
    setValue(value);
  };

  return (
    <TextField
      label={option}
      fullWidth
      onChange={handleChange}
      defaultValue={defaultValue}
      type="date"
      sx={{ maxWidth: 500 }}
      InputLabelProps={{ shrink: true }}
    />
  );
}

export default DateInput;
