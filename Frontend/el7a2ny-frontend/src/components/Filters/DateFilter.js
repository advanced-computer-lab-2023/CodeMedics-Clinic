import { TextField } from "@mui/material";

function DateFilter({option, setDate}){

    return(
        <TextField
            label={option}
            fullWidth
            onChange={(date) => {
                setDate(date.target.value);
            }}
            type="date"
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
          />
    )
}

export default DateFilter