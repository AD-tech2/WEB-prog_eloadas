import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './Index';
import CurrencyExchanger from './currancy_exchanger/Currency_main';

function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<Index/>}/>
          <Route path='CurrencyExchanger' element={<CurrencyExchanger/>}/>
          <Route path='/RockPaperScissor' element={<label>Kőpapírolló</label>}/>
      </Routes>
    </>
  );
}

export default App
