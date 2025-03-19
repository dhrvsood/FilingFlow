
import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { TaxReturns } from './pages/TaxReturns';
import { Clients } from './pages/Clients';
import { Sectors } from './pages/Sectors';
import { Settings } from './pages/Settings';


import { Frame } from './pages/Frame';

function App() {
  return (
    <>
      {
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Frame />}>
                <Route index element={<TaxReturns/>}/>
                <Route path="clients" element={<Clients/>}/>
                <Route path="sectors" element={<Sectors/>}/>
                <Route path="taxReturns" element={<TaxReturns/>}/>
                <Route path="settings" element={<Settings/>}/>
            </Route>
          </Routes>
        </BrowserRouter>     
      }
    </>
  );
}

export default App;
