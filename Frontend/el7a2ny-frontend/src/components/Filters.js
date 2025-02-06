import { Card, Stack } from "@mui/material";
import TextInput from "./Inputs/TextInput";
import MenuInput from "./Inputs/MenuInput";

function Filters({filters}){
    console.log("all filters rendered ", filters)
    const allFilters = filters.map((filter) => {
        if(filter.type === "menu"){
            console.log("menu filter", filter)
            return <MenuInput 
                options={filter.options}
                menuName={filter.name}
                setValue={filter.setState}
                />
        }
        else if(filter.type === "text" || filter.type == "date" || filter.type == "email"){
            return <TextInput option={filter.name} setValue={filter.setState} type={filter.type}/>
        }
        else{
            throw new Error('unhandled filter type');
        }
    })

    return (
        <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={3}>
                {allFilters}
            </Stack>
        </Card>
    )
}

export default Filters