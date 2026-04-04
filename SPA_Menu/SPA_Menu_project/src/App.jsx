import { Routes, Route } from 'react-router-dom';
import Index from './Index';
import MemoryGameApp from './MemoryGame/MemoryGame';
import PaintApp from './PaintingApp/PaintingApp';

function App() {
  return (
    <>
      <Routes>
          <Route path='/spa.html' element={<Index/>}/>
          <Route path='/MemmoryGame' element={<MemoryGameApp/>}/>
          <Route path='/PaintingApp' element={<PaintApp/>}/>
      </Routes>
    </>
  );
}

export default App
