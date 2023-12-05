import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';

export const AppointmentsFilter = ({setState1, setState2 , setState3 , filterStatus}) => {

    const status = [
        {value: "None" , label: "None"},
        {value: "upcoming" , label: "Upcoming"},
        {value: "completed" , label: "Completed"},
        {value: "cancelled" , label: "Cancelled"},
        {value: "rescheduled" , label: "Rescheduled"},
    ];

  return(
  <Card sx={{ p: 2 }}>
    <Stack direction="row" spacing = {3}>
        <TextField position="start"
            name="filter1"
            label="From"
            onChange={(date) => {
                setState1(date.target.value);
            }}
            type="date"
            sx={{ width: 300 }}
            InputLabelProps={{ shrink: true }}
        />
        <TextField position="start"
            name="filter2"
            label="To"
            onChange={(date) => {
                setState2(date.target.value);
            }}
            type="date"
            sx={{ width: 300 }}
            InputLabelProps={{ shrink: true }}
        />
        {filterStatus && <TextField
          sx={{width: 200}}
          id="Status"
          select
          fullWidth
          label="Status"
          defaultValue="None"
          helperText=""
          onChange={(str) => {setState3(str.target.value)}}
        >
        {status && status.map((option) => (
            <MenuItem key={option.value} value={option.value} >
              {option.label}
            </MenuItem>
          ))}
    </TextField>}
    </Stack>
  </Card>
);}
