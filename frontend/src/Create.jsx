import { Box, Container, Grid } from "@mui/material";
import Search from "./Search";
import Chat from "./Chat";
import Users from "./Users.jsx";
import PlayControl from "./PlayControl.jsx";
import { useLocation, useParams } from "react-router-dom";

function Create() {
    const { roomid } = useParams()
    const location = useLocation()
    const join = location.state || {}
    return (
        <>
            <Container maxWidth={false}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Users join={join} roomid={roomid} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Search />
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