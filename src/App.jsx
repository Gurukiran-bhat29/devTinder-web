import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body";
import Login from "./login.jsx";
import Profile from "./Profile.jsx";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
