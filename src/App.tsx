import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './components/sections/Events';
import Connections from './components/sections/Connections';
import Home from './components/sections/Home';
import Profile from './components/sections/Profile';
import Store from './components/sections/Store';
import Header from './components/sections/Header';

function App(){
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/store" element={<Store/>} />
        <Route path="/connections" element={<Connections/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;