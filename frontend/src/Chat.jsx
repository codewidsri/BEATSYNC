import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import styled from "@emotion/styled";
import Socket from "./context/Socket.js";
import { useEffect } from "react";
import { useRef } from "react";

const Item = styled(Box)({
    paddingInline: 25,
    margin: 5,
    backgroundColor: 'wheat',
    borderRadius: 10,
    width: 'fit-content'
})

function Chat({ roomid, messages, setmessages, setunread }) {
    const [send, setsend] = useState("")
    const messagesEndRef = useRef(null);

    function SendMessage() {
        setmessages(prevMessages => [...prevMessages, { who: Socket.id, message: send }])
        Socket.emit("send-message", { roomid: roomid, id: Socket.id, message: { who: Socket.id, message: send } })
        setsend("")
    }

    useEffect(() => {
        setunread(false)
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])

    return (
        <>
            <Box component={'section'}>
                <Paper elevation={5} sx={{ padding: 1.5 }}>
                    <Box component={'div'} sx={{ marginBottom: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Chip label="Chat" icon={<ChatIcon />} sx={{ width: '65%' }} />
                    </Box>
                    <Box component={'div'} sx={{ marginBottom: 2, height: { xs: '50dvh', lg: '45dvh', md: 250 }, overflow: 'auto', scrollbarWidth: "none" }}>
                        <Stack>
                            {
                                messages && messages.length != 0 && messages.map((element, index) => (
                                    <Item alignSelf={element.who === Socket.id ? "flex-end" : "flex-start"} key={index}>
                                        {element.message}
                                    </Item>
                                ))
                            }
                            <div ref={messagesEndRef} />
                        </Stack>
                    </Box>
                    <Box component={'div'} display={'flex'} alignItems={'center'}>
                        <TextField
                            fullWidth
                            label="Message"
                            size="small"
                            value={send}
                            onChange={(e) => setsend(e.target.value)}
                        />
                        <Button disabled={send ? false : true} onClick={SendMessage}>
                            <SendIcon />
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default Chat