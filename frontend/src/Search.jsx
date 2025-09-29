import { Box, Button, Card, CardContent, Grid, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useRef } from "react";
import { useEffect } from "react";
import Socket from "./context/Socket.js";

function Search({ roomid }) {

  const [result, setresult] = useState(null)
  const [query, setquery] = useState(null)
  const playerref = useRef({})
  const [apiready, setapiready] = useState(false)
  const [playingindex, setplayingindex] = useState(null)
  const [sent, setsent] = useState(null)
  const [autoplayIndex, setAutoplayIndex] = useState(null)

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setapiready(true);
    } else {
      window.onYouTubeIframeAPIReady = () => setapiready(true);
    }
  }, []);

  useEffect(() => {
    if (apiready && result) {
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
                  if (autoplayIndex == index) {
                    Socket.emit("we-are-ready", { roomid: roomid, id: Socket.id })
                    setplayingindex(0)
                    setAutoplayIndex(null)
                    setsent(0)
                  }
                }
              }
            });
        }
      });
    }
  }, [apiready, result]);

  const playVideo = (index) => {
    if (playingindex !== null) {
      playerref.current[playingindex]?.pauseVideo()
    }
    if (sent !== index) {
      Socket.emit("send-video", { roomid: roomid, video: [result[index]] })
      setsent(index)
    } else {
      Socket.emit("play-video", { roomid: roomid })
    }
    Object.values(playerref.current).forEach(player => { player.destroy && player.destroy() });
    playerref.current = {};
    setresult([result[index]])
    setplayingindex(0)
    setAutoplayIndex(0)
  };

  const pauseVideo = (index) => {
    playerref.current[index]?.pauseVideo();
    Socket.emit("pause-video", { roomid: roomid, id: Socket.id })
    setplayingindex(null)
  };

  useEffect(() => {

    Socket.on("receive-video", ({ video }) => {
      Object.values(playerref.current).forEach(player => { player.destroy && player.destroy() });
      playerref.current = {};
      setresult(video);
      setAutoplayIndex(0);
      setsent(0);
    })

    Socket.on("ready", ({ }) => {
      playerref.current[0]?.playVideo();
      setplayingindex(0)
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

  }, [result, playingindex, autoplayIndex])

  async function search() {
    try {
      const configuration = {
        headers: { "Content-Type": "application/json" }
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}search`, { query }, configuration)
      Object.values(playerref.current).forEach(player => { player.destroy() })
      playerref.current = {}
      setresult(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box component={'section'}>
        <Grid container spacing={5} alignItems={'center'}>
          <Grid size={{ xs: 12, md: 10 }}>
            <TextField
              label="Search"
              variant="outlined"
              onChange={(e) => setquery(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={search}
              sx={{ paddingInline: 3 }}
              size="small"
            ><SearchIcon /></Button>
          </Grid>
          <Grid size={12}>
            <Box component={'div'} sx={{ height: { xs: '65dvh', lg: '65dvh' }, overflow: 'auto', scrollbarWidth: "none" }}>
              {
                result && result.map((element, index) => (
                  <Card key={index}>
                    <Box component={'div'} id={`ytplayer-${index}`} sx={{ height: 200 }}></Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>{element.title}</Typography>
                        <Typography variant="subtitle1" gutterBottom>{element.duration}</Typography>
                      </CardContent>
                      {
                        playingindex == index ? (
                          <IconButton onClick={() => pauseVideo(index)} size="large">
                            <PauseCircleIcon fontSize="large" />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => playVideo(index)} size="large" >
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
      </Box>
    </>
  )
}

export default Search