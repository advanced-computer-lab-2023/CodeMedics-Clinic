import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';

export const AppointmentsFilter = ({setState1, setState2}) => {
  return(
  <Card sx={{ p: 2 }}>
    <Stack direction="row" spacing = {3}>
        <TextField position="start"
            name="filter1"
            label="From"
            fullWidth
            onChange={(date) => {
                setState1(date.target.value);
            }}
            type="date"
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
        />
        <TextField position="start"
            name="filter2"
            label="To"
            fullWidth
            onChange={(date) => {
                setState2(date.target.value);
            }}
            type="date"
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
        />
    </Stack>
  </Card>
);}
