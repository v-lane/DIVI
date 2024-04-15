import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";


import './App.scss';
import TopNavigationBar from './components/TopNavigationBar';
import SideNavigationBar from './components/SideNavigationBar';
import ThreeSectionBody from './routes/ThreeSectionBody';
import ModalView from './routes/ModalView';
import theme from './styles/createTheme';

import { ThemeProvider } from '@mui/material/styles';


//// MOCK DATA
import userProfileData from './mock_data/userProfileData';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;


  const handleClick = (() => {
    navigate(-1);
  });

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <header>
          <TopNavigationBar location={background || location}/>
        </header>
        <main>
          <SideNavigationBar location={background || location}/>
          <Routes location={background || location}>
            <Route path='/' element={<ThreeSectionBody/>} >
              <Route path="profile" element={<ModalView />} />
            </Route>
            
          </Routes>
          {background && (
            <Routes>
              <Route path='profile' element={<ModalView handleClick={handleClick} userProfileData={userProfileData} />} />
            </Routes>
          )}
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
