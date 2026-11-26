import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SocketManager from './components/SocketManager';

import Home from './components/sections/Home';
import Auth from './components/sections/Auth';
import Events from './components/sections/Events';
import Store from './components/sections/Store';
import Connections from './components/sections/Connections';
import Profile from './components/sections/Profile';

import ProfileRedirect from './components/sections/ProfileRedirect';
import ProfileSetup from './components/sections/ProfileSetup';
import NotFound from './components/sections/NotFound';

import ProtectedRoute from './components/guards/ProtectedRoute';
import ProfileRequired from './components/guards/ProfileRequired';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        containerStyle={{ top: 70 }}
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
          },
          success: { iconTheme: { primary: '#32ab2d', secondary: '#18181b' } },
          error: { iconTheme: { primary: '#ef4444 ', secondary: '#18181b' } },
        }}
      />

      <SocketManager />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/profile/:username" element={<Profile/>} />

        {/* Authenticatation required */}
        <Route element={<ProtectedRoute/>}>
          <Route path="/store" element={<Store/>} />
          <Route path="/profile" element={<ProfileRedirect/>} />
          <Route path="/profile/setup" element={<ProfileSetup/>} />

          {/* Profile required */}
          <Route element={<ProfileRequired/>}>
            <Route path="/connections" element={<Connections/>} />
            <Route path="/connections/:username" element={<Connections/>} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;