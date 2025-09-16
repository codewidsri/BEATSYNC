import { Box, Icon, IconButton, Toolbar, Typography } from "@mui/material"
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import GitHubIcon from '@mui/icons-material/GitHub';

function NavBar({ mode, toggle }) {
    return (
        <>
            <Box>
                <Toolbar>
                    <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>Beatsync</Typography>
                    <IconButton onClick={toggle}>
                        {
                            mode == 'light' ? <LightModeIcon /> : <DarkModeIcon />
                        }
                    </IconButton>
                    <IconButton>
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </Box>
        </>
    )
}

export default NavBar