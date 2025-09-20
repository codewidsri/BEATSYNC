import styled from "@emotion/styled"
import { Alert, AlertTitle, Avatar, Box, Chip, Collapse, Divider, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from "@mui/material"
import Socket from "./context/Socket.js";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tag from '@mui/icons-material/Tag';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect } from "react";
import { useState } from "react";

const Item = styled(Box)({
    padding: 10,
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
})

function Users({ roomid }) {

    const [users, setusers] = useState([])
    const [open, setopen] = useState(false)

    useEffect(() => {
        Socket.emit("get-members", { roomid: roomid })
        Socket.on("group-members", ({ members }) => {
            setusers(members)
        })
        return () => {
            Socket.off("get-members");
            Socket.off("group-members");
        };
    }, [])

    function CopyRoomId(id) {
        setopen(true)
        navigator.clipboard.writeText(id)
        setTimeout(() => {
            setopen(false)
        }, 3000);
    }

    return (
        <>
            <Box component={'section'}>
                <Paper elevation={5}>
                    <Stack>
                        <Collapse in={open} sx={{ width: '100%' }}>
                            <Alert
                                severity="success"
                                action={
                                    <IconButton size="small" onClick={() => setopen(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                }
                            >
                                <AlertTitle>copied</AlertTitle>
                            </Alert>
                        </Collapse>
                        <Item>
                            <Chip label={`Room ${roomid}`} icon={<Tag />} />
                            <IconButton size="small" onClick={() => CopyRoomId(roomid)}><ContentCopyIcon /></IconButton>
                        </Item>
                        <Divider />
                        <Item>
                            <IconButton> <GroupIcon /> </IconButton>
                            <Typography variant="body1" sx={{ flexGrow: 1 }}>connected users</Typography>
                        </Item>
                        <Item>
                            <List sx={{ width: '100%', height: { lg: '30dvh' }, overflow: 'auto' }} dense={true}>
                                {
                                    users && users.length != 0 && users.map((element, index) => (
                                        <ListItemButton key={index + 1}>
                                            <ListItemAvatar>
                                                <Avatar sizes="small">
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={element} secondary={element === Socket.id ? "(you)" : ""} />
                                        </ListItemButton>
                                    ))
                                }
                            </List>
                        </Item>
                    </Stack>
                </Paper>
            </Box>
        </>
    )
}

export default Users