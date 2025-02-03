import { TextField, MenuItem } from "@mui/material";

function MenuFilter({ options, menuName, setValue }) {

  const menuElems = options.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));

  return (
    <TextField
      sx={{ width: 500 }}
      select
      label={menuName}
      defaultValue={options[0].value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
    >
      {menuElems}
    </TextField>
  );
}

export default MenuFilter;
