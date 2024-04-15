import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';


import './App.scss';
import TopNavigationBar from './components/TopNavigationBar';
import SideNavigationBar from './components/SideNavigationBar';
import ThreeSectionBody from './routes/ThreeSectionBody';
import ModalView from './routes/ModalView';
import theme from './styles/createTheme';

import { ThemeProvider } from '@mui/material/styles';




function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [transactions, setTransactions] = useState([])

  const handleClick = (() => {
    navigate(-1);
  });

  // temp userid (to be replaced by cookies)
  const userId = 1;

  // fetch user data
  useEffect(() => {
    axios
    .get(`/api/users/${userId}`)
    .then((res) => res.data)
    .then(setUser);
  }, [])

  // fetch user groups data
  useEffect(() => {
    axios
    .get(`/api/groups/${userId}`)
    .then((res) => setGroup(res.data))
  }, [])

  useEffect(() => {
    axios
    .get(`http://localhost:3001/api/transactions/${userId}`)
    .then((res) => setTransactions(res.data))
  }, [])


  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <header>
          <TopNavigationBar location={background || location}/>
        </header>
        <main>
          <SideNavigationBar location={background || location} />
          <Routes location={background || location}>
            <Route path='/' element={<ThreeSectionBody transactionData={transactions} userGroups={group}/>} >
              <Route path='profile' element={<ModalView />} />
            </Route>
          </Routes>
          {background && (
            <Routes>
              <Route path='profile' element={<ModalView handleClick={handleClick} userProfileData={user} />} />
            </Routes>
          )}
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
