import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Send01Icon from "@heroicons/react/24/solid/ArrowSmallRightIcon";
import { Avatar, Box, IconButton, OutlinedInput, Stack, SvgIcon, Tooltip } from "@mui/material";
import { useMockedUser } from "src/hooks/use-mocked-user";

export const NewChatMessage = ({ disabled = false, onSend }) => {
  const user = useMockedUser();
  const [body, setBody] = useState("");

  const handleChange = useCallback((event) => {
    setBody(event.target.value);
  }, []);

  const handleSend = useCallback(() => {
    if (!body) return;
    onSend?.(body);
    setBody("");
  }, [body, onSend]);

  const handleKeyUp = useCallback(
    (event) => {
      if (event.code === "Enter") handleSend();
    },
    [handleSend]
  );

  return (
    <Stack alignItems="center" direction="row" spacing={2} sx={{ px: 3, py: 1 }}>
      <Avatar sx={{ display: { xs: "none", sm: "inline" } }} src={user.avatar} />
      <OutlinedInput
        disabled={disabled}
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Leave a message"
        size="small"
        value={body}
      />
      <Box sx={{ alignItems: "center", display: "flex", m: -2, ml: 2 }}>
        <Tooltip title="Send">
          <Box sx={{ m: 1, mr: 8 }}>
            <IconButton
              color="primary"
              disabled={!body || disabled}
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
              onClick={handleSend}
            >
              <SvgIcon>
                <Send01Icon />
              </SvgIcon>
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
    </Stack>
  );
};

NewChatMessage.propTypes = {
  disabled: PropTypes.bool,
  onSend: PropTypes.func,
};
