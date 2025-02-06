import { TextField } from "@mui/material";

function DateInput({ option, setValue, defaultValue }) {
  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= 10 && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setValue(value);
    }
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
