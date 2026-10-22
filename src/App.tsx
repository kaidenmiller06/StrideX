import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './components/sections/Events';


function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Events/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;