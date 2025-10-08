import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import Search from "./Search.jsx";
import Chat from "./Chat.jsx";
import Users from "./Users.jsx";
// import PlayControl from "./PlayControl.jsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ChatIcon from '@mui/icons-material/Chat';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import Socket from "./context/Socket.js";
// import PlayList from "./PlayList.jsx";

function CustomTabPanel(props) {
    const { children, value, index } = props;
    return (
        <div role="tabpanel" style={{ display: value === index ? "block" : "none" }}>
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function Create() {

    const { roomid } = useParams()
    const isMobile = useMediaQuery('(max-width:600px)')
    const [value, setvalue] = useState(0)

    //chat
    const [messages, setmessages] = useState([])
    const [unread, setunread] = useState(false)

    //songs
    const [apiready, setapiready] = useState(false)
    const [searchquery, setsearchquery] = useState('')
    const [result, setresult] = useState(null)
    const playerref = useRef({})
    const [playingindex, setplayingindex] = useState(null)
    const [videoId, setvideoId] = useState(null)

    //chat
    useEffect(() => {
        Socket.on("receive-message", ({ message }) => {
            setmessages(prevMessages => [...prevMessages, message])
            setunread(true)
        })
        return () => {
            Socket.off("receive-message")
        }
    }, [])

    //song
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setapiready(true);
        } else {
            window.onYouTubeIframeAPIReady = () => setapiready(true);
        }
    }, []);

    useEffect(() => {
        if (apiready && result) {
            Object.values(playerref.current).forEach(player => { player.destroy() })
            playerref.current = {}
            result.forEach((video, index) => {
                if (!playerref.current[index]) {
                    playerref.current[index] = new YT.Player(`ytplayer-${index}`,
                        {
                            videoId: video.videoId,
                            playerVars: {
                                controls: 0,   // hide YouTube's controls
                                modestbranding: 1, // remove YouTube logo watermark
                                rel: 0,        // don't show related videos at the end
                                showinfo: 0,   // (deprecated, but older API used it to hide info)
                                fs: 0,             // removes fullscreen button
                                iv_load_policy: 3, // disables annotations
                            },
                            events: {
                                onReady: () => {
                                    if (playingindex == index) {
                                        setplayingindex(0)
                                        setvideoId(video.videoId);
                                        Socket.emit("we-are-ready", { roomid: roomid, id: Socket.id })
                                    }
                                }
                            }
                        });
                }
            });
            setvideoId(null)
        }
    }, [apiready, result]);

    //playlist
    // const [playlist, setplaylist] = useState(null);

    // function AddToPlayList(index) {
    //     setplaylist(prev => [...prev, result[index]])
    // }

    return (
        <>
            <Container maxWidth={false}>
                <Box>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Users roomid={roomid} />
                            {/* <PlayList playlist={playlist} /> */}
                        </Grid>
                        {
                            isMobile ? (
                                <>
                                    <Grid size={12}>
                                        <Tabs value={value} onChange={(event, newvalue) => setvalue(newvalue)} centered>
                                            <Tab label="songs" icon={<MusicNoteIcon />} iconPosition="start" tabIndex={0} />
                                            {
                                                unread ? <Tab label="chat" icon={<MarkUnreadChatAltIcon />} iconPosition="start" tabIndex={1} /> :
                                                    <Tab label="chat" icon={<ChatIcon />} iconPosition="start" tabIndex={1} />
                                            }
                                        </Tabs>
                                        <CustomTabPanel value={value} index={0}>
                                            <Search
                                                roomid={roomid}
                                                result={result}
                                                setresult={setresult}
                                                searchquery={searchquery}
                                                setsearchquery={setsearchquery}
                                                playerref={playerref}
                                                setplayingindex={setplayingindex}
                                                playingindex={playingindex}
                                                videoId={videoId}
                                                setvideoId={setvideoId}
                                                // AddToPlayList={AddToPlayList}
                                            />
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={1}>
                                            <Chat roomid={roomid} messages={messages} setmessages={setmessages} setunread={setunread} />
                                        </CustomTabPanel>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Search
                                            roomid={roomid}
                                            result={result}
                                            setresult={setresult}
                                            searchquery={searchquery}
                                            setsearchquery={setsearchquery}
                                            playerref={playerref}
                                            setplayingindex={setplayingindex}
                                            playingindex={playingindex}
                                            videoId={videoId}
                                            setvideoId={setvideoId}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Chat roomid={roomid} messages={messages} setmessages={setmessages} setunread={setunread} />
                                    </Grid>
                                </>
                            )
                        }
                        {/* <Grid size={{ md: 12 }}>
                            <PlayControl />
                        </Grid> */}
                    </Grid>
                </Box>
            </Container>
        </>
    )
}

export default Create