import { TextField } from "@mui/material";

function TextFilter({option, setValue}){
    return (
        <TextField
            label={option}
            fullWidth
            onChange={(event) => {
              setValue(event.target.value);
            }}
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
          />
    )
}

export default TextFilter