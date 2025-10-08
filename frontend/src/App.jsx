import { HashRouter, Outlet, Route, Routes } from "react-router-dom"
import Home from "./Home.jsx"
import Create from "./Create.jsx"
import NavBar from "./NavBar.jsx"

function App({ mode, toggle }) {
  return (
    <HashRouter>
      <NavBar mode={mode} toggle={toggle} />
      <Outlet />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/create/:roomid" element={<Create />} />
      </Routes>
    </HashRouter>
  )
}

export default App