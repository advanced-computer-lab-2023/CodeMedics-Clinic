import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';

export const DoctorSearch = ({handleSearch , handleFilter, skipFiltering}) => {
  const appointmentState = [
    {value: "None" , label: "None"} ,
    {value: "unreserved" , label: "unreserved"} ,
    {value: "upcoming" , label: "upcoming"} ,
    {value: "completed" , label: "completed"} ,
    {value: "cancelled" , label: "cancelled"},
    {value: "rescheduled" , label: "rescheduled"}
  ];

  //'unreserved', 'upcoming', 'completed', 'cancelled', 'rescheduled'

  return(
  <Card sx={{ p: 2 }}>
    <Stack direction="row" spacing = {3}>
    <OutlinedInput
      defaultValue=""
      onChange={(str) => {
        handleSearch(str.target.value);
      }}
      fullWidth
      placeholder="Search"
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
    {!skipFiltering && (
      <TextField
      sx={{ width: 200 }}
      id="appointment-status"
      select
      label="Appointment Status"
      defaultValue="None"
      helperText=""
      onChange={(str) => {handleFilter(str.target.value)}}
    >
    {appointmentState.map((option) => (
        <MenuItem key={option.value} value={option.value} >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
    )}
    </Stack>
  </Card>
);}
