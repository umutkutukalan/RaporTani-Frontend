import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Rapor from './packages/Rapor';
import Hasta from './packages/Hasta';
import Doktor from './packages/Doktor';
import Layout from './layout/Layout';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Hasta />}></Route>
            <Route path='doktor' element={<Doktor />} />
            <Route path='kayıt' element={<Rapor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
