import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import Events from './components/sections/Events';
import Connections from './components/sections/Connections';
import Home from './components/sections/Home';
import Profile from './components/sections/Profile';
import Store from './components/sections/Store';
import Auth from './components/sections/Auth';
import NotFound from './components/sections/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#18181b', color: '#fff' }, // stridex-black
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/profile/:username" element={<Profile/>} />

        {/* Logged-in only */}
        <Route element={<ProtectedRoute/>}>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/connections" element={<Connections/>} />
          <Route path="/store" element={<Store/>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;