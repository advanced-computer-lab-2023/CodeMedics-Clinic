import { TextField } from "@mui/material";

function DateInput({option, setDate}){

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

export default DateInput