import {Stack, Typography} from "@mui/material"

function Header({name}){
    return (
        <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{name}</Typography>
              </Stack>
        </Stack>
    )
}

export default Header