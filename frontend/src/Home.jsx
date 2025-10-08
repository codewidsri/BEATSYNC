import { Alert, AlertTitle, Box, Button, Card, CardContent, Collapse, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Typography } from "@mui/material"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import TelegramIcon from '@mui/icons-material/Telegram';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import Socket from "./context/Socket.js";
import { useState } from "react";

function Home() {
    const [roomid, setroomid] = useState()
    const [open, setopen] = useState(false)
    const navigate = useNavigate()

    function CreateRoom() {
        Socket.emit("create-room", {})
        navigate(`/create/${Socket.id}`)
    }

    function JoinRoom() {
        if (!roomid) {
            setopen(true)
        } else {
            Socket.emit("join-room", { roomid: roomid })
            navigate(`/create/${roomid}`)
        }
    }

    return (
        <>
            <Container maxWidth='sm' sx={{ padding: 5 }}>
                <Box component={'div'}>
                    <Collapse in={open}>
                        <Alert severity="error"
                            action={
                                <IconButton size="small" onClick={() => setopen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            }>
                            <AlertTitle>Error</AlertTitle>
                            please enter the room id correctly
                        </Alert>
                    </Collapse>
                    <Paper elevation={15}>
                        <Card sx={{ display: 'flex', alignItems: "center", justifyContent: 'center' }}>
                            <CardContent sx={{ width: '85%' }}>
                                <Typography gutterBottom variant="h6" textAlign={'center'} sx={{ fontWeight: 'bolder' }}>Join a Beatsync Room</Typography>
                                <Typography gutterBottom variant="body2" textAlign={'center'}>Enter a room code to join or create a new room</Typography>
                                <Box component={'section'}>
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <InputLabel htmlFor="code">Room code</InputLabel>
                                        <OutlinedInput
                                            id="RoomCode"
                                            startAdornment={
                                                <InputAdornment position="start">#</InputAdornment>
                                            }
                                            label="Room Code"
                                            onChange={(e) => setroomid(e.target.value)}
                                        />
                                    </FormControl>
                                    <Button fullWidth sx={{ mt: 2, borderRadius: 10, padding: 1.5 }} size="small" variant="contained" onClick={JoinRoom} startIcon={<TelegramIcon />}>
                                        {/* <TelegramIcon sx={{ color: 'white', marginInline: 1 }} /> */}
                                        <Typography variant="body2">Join</Typography>
                                    </Button>
                                </Box>
                                <Typography variant="body1" textAlign={'center'} gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>(or)</Typography>
                                <Button fullWidth sx={{ mt: 1, borderRadius: 10, padding: 1.5 }} variant="contained" size="small" onClick={CreateRoom} startIcon={<ControlPointIcon />}>
                                    {/* <ControlPointIcon sx={{ color: 'white', marginInline: 1 }} /> */}
                                    <Typography variant="body2">Create New Room</Typography>
                                </Button>
                            </CardContent>
                        </Card>
                    </Paper>
                </Box>
            </Container >
        </>
    )
}

export default Home