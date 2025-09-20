import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import styled from "@emotion/styled";
import Socket from "./context/Socket";
import { useEffect } from "react";

const Item = styled(Box)({
    paddingInline: 25,
    margin: 5,
    backgroundColor: 'wheat',
    borderRadius: 10,
    width: 'fit-content'
})

function Chat({ roomid }) {
    const [send, setsend] = useState("")
    const [messages, setmessages] = useState([])

    function SendMessage() {
        setsend("")
        Socket.emit("send-message", { roomid: roomid, message: { who: Socket.id, message: send } })
    }

    useEffect(() => {
        Socket.on("receive-message", ({ message }) => {
            setmessages(prevMessages => [...prevMessages, message])
        })

        return () => {
            Socket.off("receive-message")
        }
    }, [])

    return (
        <>
            <Box component={'section'}>
                <Paper elevation={5} sx={{ padding: 2 }}>
                    <Box component={'div'} sx={{ marginBottom: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Chip label="Chat" icon={<ChatIcon />} sx={{ width: '65%' }} />
                    </Box>
                    <Box component={'div'} sx={{ marginBottom: 5, height: { lg: '45dvh', md: 250 }, overflow: 'auto', scrollbarWidth: "none" }}>
                        <Stack>
                            {
                                messages && messages.length != 0 && messages.map((element, index) => (
                                    <Item alignSelf={element.who === Socket.id ? "flex-end" : "flex-start"} key={index}>
                                        {element.message}
                                    </Item>
                                ))
                            }
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