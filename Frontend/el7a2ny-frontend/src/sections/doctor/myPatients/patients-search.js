import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';

export const CustomersSearch = ({handleSearch , handleFilter}) => {
  const withUpcomingAppoinmtents = [
    {value: "None" , label: "None"} ,
    {value: "Yes" , label: "Yes"} ,
    {value: "No" , label: "No"} ,
  ];

  return(
  <Card sx={{ p: 2 }}>
    <Stack direction="row" spacing = {3}>
    <OutlinedInput
      defaultValue=""
      onChange={(str) => {
        handleSearch(str.target.value);
      }}
      fullWidth
      placeholder="Search Patient"
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: 500 }}
    />
    <TextField
          sx={{ width: 200 }}
          id="upcoming"
          select
          label="With Upcoming Appointments"
          defaultValue="None"
          helperText=""
          onChange={(str) => {handleFilter(str.target.value)}}
        >
        {withUpcomingAppoinmtents.map((option) => (
            <MenuItem key={option.value} value={option.value} >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
    </Stack>
  </Card>
);}
