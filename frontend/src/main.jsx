import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { useState } from 'react'

function Root() {

  const [mode, setmode] = useState(localStorage.getItem("theme") || "light")

  const light = {
    mode: "light",
    primary: { main: "#000000ff" },
    secondary: { main: "#080808ff" },
    background: {
      default: "#ffffffff",
      paper: "#ffffffff",
    },
    text: {
      primary: "#000000ff",
      secondary: "#303130ff"
    },
  }

  const dark = {
    mode: "dark",
    primary: { main: "#ffffffff" },
    secondary: { main: "#ffffffff" },
    background: {
      default: "#1f1e1eff",
      paper: "#1f1e1eff"
    },
    text: {
      primary: "#ffffffff",
      secondary: "#c2afafff"
    }
  }

  const theme = createTheme({
    palette: mode == 'light' ? light : dark,
    components : {
      MuiOutlinedInput:{
        styleOverrides:{
          root:{
            borderRadius : '10px',
          }
        }
      },
    }
  })

  const toggle = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setmode(newMode);
    localStorage.setItem("theme", newMode);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App mode={mode} toggle={toggle} />
      </ThemeProvider>
    </>
  )
}

createRoot(document.getElementById('root')).render(<Root />)