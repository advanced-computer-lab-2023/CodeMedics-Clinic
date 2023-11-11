import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';

export const AppointmentsFilter = ({handleFilter}) => {
  return(
  <Card sx={{ p: 2 }}>
    <Stack direction="row" spacing = {3}>
        <TextField position="start"
            name="filter"
            fullWidth
            onChange={(date) => {
                handleFilter(date.target.value);
            }}
            type="date"
            sx={{ maxWidth: 500 }}
        />
    </Stack>
  </Card>
);}
