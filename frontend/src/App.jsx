import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

import './App.scss';
import './styles/Buttons.scss';

import TopNavigationBar from './components/TopNavigationBar';
import SideNavigationBar from './components/SideNavigationBar';
import ThreeSectionBody from './routes/ThreeSectionBody';
import ModalView from './routes/ModalView';
import theme from './styles/createTheme';

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import useModalView from './hooks/useModalView';
import UserProfile from './components/modals/UserProfile';
import CreateGroupForm from './components/modals/CreateGroupForm';
import DeleteUserProfile from './components/modals/DeleteUserProfile';
import UserDeleted from './components/modals/UserDeleted';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { profileView, newGroupView, deleteProfileView, deleteConfirmation, setDeleteConfirmation, setProfileView, setNewGroupView, setDeleteProfileView, closeModal, openModal } = useModalView();
  // const [profileView, setProfileView] = useState(true);
  // const [newGroupView, setNewGroupView] = useState(false);
  const [memberTransactions, setMemberTransactions] = useState([]);

  const handleClick = (() => {
    navigate(-1);
    closeModal();
  });

  const confirmDelete = (() => {
    closeModal();
    openModal("profile-delete");
  });

  const cancelDelete = (() => {
    closeModal();
    openModal("profile");
  })

  const deleteUser = (() => {
    axios
      .delete(`/api/users/${userId}`)
      .then((res) => console.log(res.status))
      .then(closeModal())
      .then(openModal('delete-confirmation'))
      .catch((err) => {
        console.error(err)
      })
  })

  // temp userid (to be replaced by cookies)
  const userId = 5;

  // fetch user data
  useEffect(() => {
    axios
      .get(`/api/users/${userId}`)
      .then((res) => res.data)
      .then(setUser);
  }, []);

  // fetch user groups data
  useEffect(() => {
    axios
      .get(`/api/groups/${userId}`)
      .then((res) => setGroup(res.data));
  }, []);

  // fetch transaction data for a specific user
  useEffect(() => {
    axios
      .get(`/api/transactions/${userId}`)
      .then((res) => setTransactions(res.data));
  }, []);

  // fetch member transaction data for a specific user
  useEffect(() => {
    axios
      .get(`/api/member_transactions/${userId}`)
      .then((res) => setMemberTransactions(res.data));
  }, []);


  return (
    <div className='App'>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <header>
          <TopNavigationBar location={background || location} />
        </header>
        <main>
          <SideNavigationBar location={background || location} openModal={openModal} />
          <Routes location={background || location}>
            <Route path='/' element={<ThreeSectionBody user={user} memberTransactions={memberTransactions} transactionData={transactions} userGroups={group} openModal={openModal} />} >
              <Route element={<ModalView />} >
                <Route path='profile' element={<UserProfile />} />
                <Route path='new-group' element={<CreateGroupForm />} />
                <Route path='profile-delete' element={<DeleteUserProfile />} />
                <Route path='delete-confirmation' element={<UserDeleted />} />
              </Route>
            </Route>
          </Routes>
          {background && (
            <Routes>
              <Route element={<ModalView handleClick={handleClick} cancelDelete={cancelDelete} confirmDelete={confirmDelete}  deleteUser={deleteUser} userProfileData={user} useModalView={{ profileView, newGroupView, deleteProfileView, deleteConfirmation, closeModal, openModal }} />} >
                <Route path='profile' element={<UserProfile />} />
                <Route path='new-group' element={<CreateGroupForm />} />
                <Route path='profile-delete' element={<DeleteUserProfile />} />
                <Route path='delete-confirmation' element={<UserDeleted />} />
              </Route>

            </Routes>
          )}
        </main>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
