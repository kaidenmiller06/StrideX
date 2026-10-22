import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './components/sections/Events';


function App(){
  return (
    <h1>
      <Routes>
        <Route path="/groups" element={<Events/>} />
      </Routes>
    </h1>
  );
}

export default App;