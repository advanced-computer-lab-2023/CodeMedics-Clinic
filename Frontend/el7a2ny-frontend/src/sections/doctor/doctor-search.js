import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';

export const DoctorsSearch = ({handleSearch , sepcialities , handleSpecialityFilter}) => {
  return(
  <Card sx={{ p: 2 }}>
    <Stack direction="row" spacing = {3}>
    <OutlinedInput
      defaultValue=""
      onChange={(str) => {
        handleSearch(str.target.value);
      }}
      fullWidth
      placeholder="Search Doctor"
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
      sx={{ maxWidth: 400 }}
    />
    <TextField
          sx={{width: 220}}
          id="speciality"
          select
          label="Speciality"
          defaultValue="None"
          helperText=""
          onChange={(str) => {handleSpecialityFilter(str.target.value)}}
        >
        {sepcialities.map((option) => (
            <MenuItem key={option.value} value={option.value} >
              {option.label}
            </MenuItem>
          ))}
    </TextField>
    <TextField
                  label="Available Date"
                  name="DateOfBirth"
                  onChange={(event) => {
                  const value = event.target.value;
                  if (value.length <= 10) {
                    const yyyy = value.slice(0, 4).replace(/[^0-9]/g, '');
                    const mmdd = value.slice(4);
                    const formattedValue = `${yyyy}${mmdd}`;
                  }
                }}
                // text field for setting date and time 
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                />
    </Stack>
  </Card>
);}
