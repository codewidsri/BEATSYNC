import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material"
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
    const [sendmessage, setsendmessage] = useState()
    const [messages, setmessages] = useState([])

    function SendMessage() {
        Socket.emit("send-message", { roomid: roomid, message: { who: Socket.id, message: sendmessage } })
    }

    useEffect(() => {
        Socket.on("receive-message", ({ message }) => {
            console.log(message)
            setmessages([...messages,message])
        })
    }, [])

    return (
        <>
            <Box component={'section'} sx={{ paddingInline: 5 }}>
                <Box component={'div'} sx={{ marginBottom: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Chip label="Chat" icon={<ChatIcon />} sx={{ width: '65%' }} />
                </Box>
                <Box component={'div'} sx={{ marginBottom: 5, height: { lg: 250, md: 250 }, }}>
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
                        onChange={(e) => setsendmessage(e.target.value)}
                    />
                    <Button disabled={sendmessage ? false : true} onClick={SendMessage}>
                        <SendIcon />
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default Chat