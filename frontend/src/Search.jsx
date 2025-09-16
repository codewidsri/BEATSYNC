import { Box, Button, Card, CardContent, CardMedia, Grid, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { useRef } from "react";
import { useEffect } from "react";

function Search() {

  const [result, setresult] = useState()
  const [query, setquery] = useState()
  const playerref = useRef({})
  const [apiready, setapiready] = useState(false)
  const [play, setplay] = useState(true)
  const [pause, setpause] = useState(false)

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = () => {
        setapiready(true)
      }
    } else {
      setapiready(true)
    }
  }, [])

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
            });
        }
      });
    }
  }, [apiready, result]);

  const playVideo = (index) => {
    setplay(false)
    setpause(true)
    playerref.current[index]?.playVideo();
  };

  const pauseVideo = (index) => {
    setpause(false)
    setplay(true)
    playerref.current[index]?.pauseVideo();
  };

  async function search() {
    try {
      const configuration = {
        headers: { "Content-Type": "application/json" }
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}search`, { query }, configuration)
      setresult(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box component={'section'} sx={{ paddingInline: 5}}>
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
              sx={{ paddingInline: 6 }}
            >search</Button>
          </Grid>
          <Grid size={12}>
            <Box component={'div'} sx={{ height: { xs: 100, lg: '65dvh' }, overflow: 'auto', scrollbarWidth: "none" }}>
              {
                result && result.map((element, index) => (
                  <Card key={index} sx={{ marginBlock: 3 }}>
                    <Box component={'div'} id={`ytplayer-${index}`} sx={{ height: 200 }}></Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>{element.title}</Typography>
                      </CardContent>
                      {
                        play && <IconButton onClick={() => playVideo(index)} size="large" >
                          <PlayCircleIcon fontSize="large" />
                        </IconButton>
                      }
                      {
                        pause && <IconButton onClick={() => pauseVideo(index)} size="large">
                          <PauseCircleIcon fontSize="large" />
                        </IconButton>
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