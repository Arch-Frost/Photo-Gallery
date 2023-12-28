import Drive from "./components/Drive";
import Home from "./components/Home";
import Login from "./components/Login";
import Nav from "./components/Nav";
import Register from "./components/Register";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
  <>
  <Router>
    <Nav/>
    <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/drive" element={<Drive/>}/>
    </Routes>
  </Router>

  </>
  );
}

export default App;
