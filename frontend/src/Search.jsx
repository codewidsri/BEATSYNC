import { Box, Button, Card, CardContent, Chip, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SearchIcon from '@mui/icons-material/Search';
// import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { useEffect } from "react";
import Socket from "./context/Socket.js";

function Search({ roomid, result, setresult, searchquery, setsearchquery, playerref, playingindex, setplayingindex, videoId, setvideoId }) {

  async function search() {
    try {
      const configuration = {
        headers: { "Content-Type": "application/json" }
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}search`, { searchquery }, configuration)
      setresult(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const playVideo = (index, videoid) => {
    if (videoid !== videoId) {
      Socket.emit("send-video", { roomid: roomid, id: Socket.id, video: [result[index]] })
      setresult([result[index]])
      setvideoId(videoid)
      setplayingindex(0)
    } else {
      Socket.emit("play-video", { roomid: roomid })
    }
  };

  const pauseVideo = (index) => {
    playerref.current[index]?.pauseVideo();
    Socket.emit("pause-video", { roomid: roomid, id: Socket.id })
    setplayingindex(null)
  };

  useEffect(() => {

    Socket.on("receive-video", ({ video }) => {
      setresult(video);
      setplayingindex(0)
    })

    Socket.on("ready", ({ }) => {
      playerref.current[0]?.playVideo();
    })

    Socket.on("play", ({ }) => {
      playerref.current[0]?.playVideo();
      setplayingindex(0)
    })

    Socket.on("pause", ({ }) => {
      playerref.current[0]?.pauseVideo();
      setplayingindex(null)
    })

    return () => {
      Socket.off("receive-video");
      Socket.off("ready");
      Socket.off("play");
      Socket.off("pause");
    }

  }, [result, playingindex])

  return (
    <>
      <Box component={'section'}>
        <Paper elevation={5} sx={{ padding: 2 }}>
          <Grid container spacing={2} alignItems={'center'}>
            <Grid size={{ xs: 9, md: 10 }}>
              <TextField
                label="Search"
                variant="outlined"
                onChange={(e) => setsearchquery(e.target.value)}
                fullWidth
                size="small"
                value={searchquery}
              />
            </Grid>
            <Grid size={{ xs: 3, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={search}
                sx={{ paddingInline: 3 }}
                size="small"
              ><SearchIcon /></Button>
            </Grid>
            <Grid size={12}>
              <Box component={'div'} sx={{ height: { xs: '55dvh', lg: '61dvh' }, overflow: 'auto', scrollbarWidth: "none" }}>
                {
                  result && result.map((element, index) => (
                    <Card key={index} sx={{marginBlock:2}}>
                      <Box component={'div'} id={`ytplayer-${index}`} sx={{ height: 200, width: '100%' }}></Box>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <CardContent>
                          <Typography variant="body1" gutterBottom>{element.title}</Typography>
                          <Chip label={element.duration} sx={{ fontWeight: 'bold' }} />
                          {/* <Button variant="contained" sx={{ textTransform: "none", marginInlineStart: 2 }} startIcon="Add to Playlist" endIcon={<QueueMusicIcon />} onClick={()=>AddToPlayList(index)} /> */}
                        </CardContent>
                        {
                          playingindex == index ? (
                            <IconButton onClick={() => pauseVideo(index)} size="large">
                              <PauseCircleIcon fontSize="large" />
                            </IconButton>
                          ) : (
                            <IconButton onClick={() => playVideo(index, element.videoId)} size="large" >
                              <PlayCircleIcon fontSize="large" />
                            </IconButton>
                          )
                        }
                      </Box>
                    </Card>
                  ))
                }
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  )
}

export default Search