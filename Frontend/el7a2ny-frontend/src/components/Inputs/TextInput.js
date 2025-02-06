import { TextField } from "@mui/material";

function TextInput({option, setValue, defaultValue, type}){
    return (
        <TextField
            label={option}
            fullWidth
            defaultValue={defaultValue}
            type={type}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            sx={{ maxWidth: 500 }}
            InputLabelProps={{ shrink: true }}
          />
    )
}

export default TextInput