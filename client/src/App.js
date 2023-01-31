import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/UI/Main";
import Ready from "./components/UI/Ready";
import Game from "./components/UI/Game";
import Error from "./components/UI/Error";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/ready/*" element={<Ready />} />
        <Route path="/game/*" element={<Game />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
