import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Attachment01Icon from '@heroicons/react/24/solid/PaperClipIcon';
import Camera01Icon from '@heroicons/react/24/solid/PhotoIcon';
import Send01Icon from '@heroicons/react/24/solid/ArrowSmallRightIcon';
import { Avatar, Box, IconButton, OutlinedInput, Stack, SvgIcon, Tooltip } from '@mui/material';
import { useMockedUser } from '../../../hooks/use-mocked-user';

export const ChatMessageAdd = (props) => {
  const { disabled, onSend} = props;
  const user = useMockedUser();
  const fileInputRef = useRef(null);
  const [body, setBody] = useState('');

  const handleAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback((event) => {
    setBody(event.target.value);
  }, []);

  const handleSend = useCallback(() => {
    if (!body) {
      return;
    }

    onSend?.(body);
    setBody('');
  }, [body, onSend]);

  const handleKeyUp = useCallback((event) => {
    if (event.code === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={2}
      sx={{
        px: 3,
        py: 1
      }}
      >
      <Avatar
        sx={{
          display: {
            xs: 'none',
            sm: 'inline'
          }
        }}
        src={user.avatar}
      />
      <OutlinedInput
        disabled={disabled}
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Leave a message"
        size="small"
        value={body}
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          m: -2,
          ml: 2
        }}
      >
        <Tooltip title="Send">
          <Box sx={{ m: 1 }}>
            <IconButton
              color="primary"
              disabled={!body || disabled}
              sx={{
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              onClick={handleSend}
            >
              <SvgIcon>
                <Send01Icon />
              </SvgIcon>
            </IconButton>
          </Box>
        </Tooltip>
        {/* <Tooltip title="Attach photo">
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'inline-flex'
              },
              m: 1
            }}
          >
            <IconButton
              disabled={disabled}
              edge="end"
              onClick={handleAttach}
            >
              <SvgIcon>
                <Camera01Icon />
              </SvgIcon>
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title="Attach file">
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'inline-flex'
              },
              m: 1
            }}
          >
            <IconButton
              disabled={disabled}
              edge="end"
              onClick={handleAttach}
            >
              <SvgIcon>
                <Attachment01Icon />
              </SvgIcon>
            </IconButton>
          </Box>
        </Tooltip> */}
      </Box>
      <input
        hidden
        ref={fileInputRef}
        type="file"
      />
    </Stack>
  );
};

ChatMessageAdd.propTypes = {
  disabled: PropTypes.bool,
  onSend: PropTypes.func
};

ChatMessageAdd.defaultProps = {
  disabled: false
};
