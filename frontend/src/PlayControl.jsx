import { Box, Button } from "@mui/material"
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

function PlayControl() {
    return (
        <>
            <Box component={'section'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button>
                    <SkipPreviousIcon fontSize="large"/>
                </Button>
                <Button>
                    <PlayCircleIcon fontSize="large" />
                </Button>
                <Button>
                    <SkipNextIcon fontSize="large"/>
                </Button>
            </Box>
        </>
    )
}

export default PlayControl