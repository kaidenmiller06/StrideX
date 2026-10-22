import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './components/sections/Events';
import Connections from './components/sections/Connections';
import Home from './components/sections/Home';
import Profile from './components/sections/Profile';
import Store from './components/sections/Store';


function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Events" element={<Events/>} />
        <Route path="/Store" element={<Store/>} />
        <Route path="/Connections" element={<Connections/>} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;