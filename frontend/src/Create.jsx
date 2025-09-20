import { Box, Container, Grid } from "@mui/material";
import Search from "./Search";
import Chat from "./Chat";
import Users from "./Users.jsx";
import PlayControl from "./PlayControl.jsx";
import { useParams } from "react-router-dom";

function Create() {
    const { roomid } = useParams()
    return (
        <>
            <Container maxWidth={false}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Users roomid={roomid} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Search roomid={roomid}/>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Chat roomid={roomid}/>
                        </Grid>
                        <Grid size={{ md: 12 }}>
                            <PlayControl />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    )
}

export default Create