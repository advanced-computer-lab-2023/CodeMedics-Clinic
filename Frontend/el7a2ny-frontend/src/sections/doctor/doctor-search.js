import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon,Stack,TextField,MenuItem } from '@mui/material';

export const DoctorsSearch = ({handleSearch}) => {
  const medicalUse = [
    {value: "None" , label: "None"} ,
    {value: "Pain relief" , label: "Pain relief"} ,
    {value: "Fever" , label: "Fever"} ,
    {value: "Cold and Flu" , label: "Cold and Flu"} ,
    {value: "Antibiotic" , label: "Antibiotic"} ,
    {value: "Cough" , label: "Cough"} ,
    {value: "Pain management" , label: "Pain management"} ,
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
      sx={{ maxWidth: 500 }}
    />
    </Stack>
  </Card>
);}
