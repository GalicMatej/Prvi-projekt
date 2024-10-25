import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import AppLayout from './ui/AppLayout';
import Generating from './pages/Generating';
import PersonDetails from './pages/PersonDetails';
import Callback from './pages/Callback';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="main" />}/>
          <Route path='main' element={<MainPage />}/>
          <Route path='generateQrCode' element={<Generating />} />
        </Route>
          <Route path='callback' element={<Callback />} />
          <Route path='user/*' element={<PersonDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
