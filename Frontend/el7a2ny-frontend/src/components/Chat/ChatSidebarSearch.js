import { forwardRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Box, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

export const ChatSidebarSearch = forwardRef(({ searchName, setSearchName }, ref) => {
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchName(value);
  };

  return (
    <Box sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        value={searchName}
        onChange={handleSearchChange}
        placeholder="Search Chats"
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon>
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        inputRef={ref}
      />
    </Box>
  );
});
