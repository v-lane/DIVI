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
import OneSectionBody from './routes/OneSectionBody';

import theme from './styles/createTheme';

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import useModalView from './hooks/useModalView';
import UserProfile from './components/modals/UserProfile';
import CreateGroupForm from './components/modals/CreateGroupForm';
import GroupsAll from './components/Groups/GroupsAll';
import NotificationsAll from './components/Notifications/NotificationsAll';

import DeleteUserProfile from './components/modals/DeleteUserProfile';
import UserDeleted from './components/modals/UserDeleted';
import EditUserForm from './components/modals/EditUserForm';
import TransactionsAll from './components/TransactionsAll';
import AddExpenseForm from './components/modals/AddExpenseForm';
import AddPaymentForm from './components/modals/AddPaymentForm';
import TransactionDetails from './components/modals/TransactionDetails';
import AddMemberForm from './components/modals/AddMemberForm';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;

  // app data, should be moved to custom hook(useApplicationData)
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [memberTransactions, setMemberTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeGroupDetails, setActiveGroupDetails] = useState([]);
  const [activeTransaction, setActiveTransaction] = useState(0);
  const [activeTransactionDetails, setActiveTransactionDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    profileView,
    newGroupView,
    deleteProfileView,
    deleteConfirmation,
    editUser,
    addExpense,
    addPayment,
    transactionDetails,
    addGroupMemberView,
    closeModal,
    openModal,
    navigateModal } = useModalView();

  const deleteUser = (() => {
    axios
      .delete(`/api/users/${userId}`)
      .then((res) => console.log(res.status))
      .then(navigateModal('delete-confirmation'))
      .then(setUser(null))
      // add redirect to homepage
      .catch((err) => {
        console.error(err);
      });
  });

  // temp userid (to be replaced by cookies)
  const userId = 1;

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

  // fetch data for a specific group
  useEffect(() => {
    if (activeGroup > 0) {
      axios
        .get(`/api/users_by_group/${activeGroup}`)
        .then((res) => {
          setActiveGroupDetails(res.data);
        });
    }
  }, [activeGroup]);

  useEffect(() => {
    if (activeTransaction > 0) {
      axios
        .get(`/api/transaction_by_id/${activeTransaction}`)
        .then((res) => {
          setActiveTransactionDetails(res.data);
          setIsLoading(false);
        });
    };
  }, [activeTransaction]);

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
  }, [transactions]);

  // fetch user notifications data
  useEffect(() => {
    axios
      .get(`/api/notifications/${userId}`)
      .then((res) => setNotifications(res.data));
  }, []);

  // set group id for group dashboard view
  useEffect(() => {
    const checkIfGroup = location.pathname.slice(0, 6);
    if (checkIfGroup === '/group') {
      setActiveGroup(location.pathname.slice(7, 8));
    } else {
      setActiveGroup(0);
    }
  }, [location]);

  useEffect(() => {
    const checkIfTransactionDetails = location.pathname.slice(0, 20);
    if (checkIfTransactionDetails === '/transaction-details') {
      setActiveTransaction(location.pathname.slice(21, 22));
    } else {
      setActiveTransaction(0);
    }
  }, []);

  return (
    <div className='App'>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <header>
            <TopNavigationBar location={background || location} />
          </header>
          <main>
            <SideNavigationBar location={background || location} openModal={openModal} activeGroup={activeGroup} user={user} activeGroupDetails={activeGroupDetails} />
            <Routes location={background || location}>
              
              <Route path='/' element={<ThreeSectionBody user={user} memberTransactions={memberTransactions} transactionData={transactions} setActiveTransaction={setActiveTransaction} userGroups={group} activeGroup={activeGroup} openModal={openModal} activeGroupDetails={activeGroupDetails} />} />
              
              <Route element={<OneSectionBody user={user} memberTransactions={memberTransactions} transactionData={transactions} userGroups={group} openModal={openModal} notifications={notifications} />}>
                <Route path='all_groups' element={<GroupsAll />} />
                <Route path='all_transactions' element={<TransactionsAll />} />
                <Route path='all_notifications' element={<NotificationsAll />} />
              </Route>
              
              <Route path='group/:id/dashboard/' element={<ThreeSectionBody user={user} memberTransactions={memberTransactions} setActiveTransaction={setActiveTransaction} transactionData={transactions} userGroups={group} activeGroup={activeGroup} openModal={openModal} activeGroupDetails={activeGroupDetails} />} />


            </Routes>
            {background && (
              <Routes>
                <Route element={<ModalView isLoading={isLoading} deleteUser={deleteUser} userProfileData={user} setUser={setUser} group={group} transactions={transactions} setTransactions={setTransactions} activeTransactionDetails={activeTransactionDetails} activeGroup={activeGroup} activeGroupDetails={activeGroupDetails} useModalView={{ profileView, newGroupView, deleteProfileView, deleteConfirmation, editUser, addExpense, addPayment, transactionDetails, addGroupMemberView, closeModal, openModal, navigateModal }} />} >
                  <Route path='profile' element={<UserProfile />} />
                  <Route path='new-group' element={<CreateGroupForm />} />
                  <Route path='profile-delete' element={<DeleteUserProfile />} />
                  <Route path='delete-confirmation' element={<UserDeleted />} />
                  <Route path='profile-edit' element={<EditUserForm />} />
                  <Route path='add-expense' element={<AddExpenseForm />} />
                  <Route path='add-payment' element={<AddPaymentForm />} />
                  <Route path='transaction-details/:id' element={<TransactionDetails />} />
                  <Route path='group/:id/dashboard/add_group_member' element={<AddMemberForm />} />

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
