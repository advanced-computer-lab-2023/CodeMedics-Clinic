import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';
import { set } from 'nprogress';

export const PrescriptionsFilter = ({ setFilterStartDate, setFilterEndDate, setFilledStatus, setDoctor }) => {
  const status = [  
    {
      value: true,
      label: 'filled',
    },
    {
      value: false,
      label: 'unfilled',
    }
  ];

    return (
      <Card sx={{ p: 2 }}>
        <Stack direction="row" spacing={3}>
        <TextField
            position="start"
            name="Doctor"
            label="Doctor"
            fullWidth
            onChange={(event) => {
              setDoctor(event.target.value);
            }}
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
          />
        <TextField
                  sx={{ width: 500 }}
                  name="Filled"
                  select
                  label="Filled"
                  defaultValue=""
                  helperText=""
                  onChange={(event) => {
                    setFilledStatus(event.target.value);
                  }}
                >
                {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
          </TextField>
          <TextField
            position="start"
            name="filterStartDate"
            label="Start Date"
            fullWidth
            onChange={(date) => {
              setFilterStartDate(date.target.value);
            }}
            type="date"
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            position="start"
            name="filterEndDate"
            label="End Date"
            fullWidth
            onChange={(date) => {
              setFilterEndDate(date.target.value);
            }}
            type="date"
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Card>
    );
  };
