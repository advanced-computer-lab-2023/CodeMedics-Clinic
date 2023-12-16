import { Stack, Box, Container, Divider, Unstable_Grid2 as Grid, Typography, Avatar, Card, OutlinedInput, InputAdornment, SvgIcon, IconButton, Tooltip } from '@mui/material';
import { Message } from './Message';
import {useEffect, useRef} from 'react';


export const ChatMessages = (props) => {
    const { messages, username } = props;
    const ref = useRef(null);

    useEffect(() => {
        if(ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
    }, [messages]);
    return (
        <div>
        <Stack spacing={2}
        sx={{ p: 3 }}>
            {messages.map((message, index) => {
                return (
                    <Message message={message.content} position={message.sender == username ? 'right' : 'left'} />

                )
            })
            }
        </Stack>
        <div ref={ref}/>
        </div>
    );
};