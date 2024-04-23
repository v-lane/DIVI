import React, { useState } from "react";
import '/src/styles/AddPaymentForm.scss';
import { Button, MenuItem, TextField, Alert } from "@mui/material";
import axios from 'axios';

const AddPaymentForm = (props) => {
  const { userProfileData, useModalView, group, setTransactions, activeGroupDetails } = props;
  let currentUser = '';
  userProfileData ? currentUser = userProfileData : '';
  const groupNames = activeGroupDetails.name ? [activeGroupDetails.name] : group.map((item) => item.name);
  const memberNames = [];
  const [formError, setFormError] = useState(null);

  const handleClose = () => {
    setFormError(null);
  };

  if (activeGroupDetails.users) {
    for (const user of activeGroupDetails.users) {
      user.username === userProfileData.username ? '' : memberNames.push(`${activeGroupDetails.name} - ${user.username}`);
    }
  } else {
    for (const singleGroup of group) {
      for (const user of singleGroup.users) {
        if (user.id !== currentUser.id) {
          memberNames.push(`${singleGroup.name} - ${user.username}`);
        }
      }
    }
  }

  // const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    group_name: '',
    member_name: '',
    amount: ''
  });

  const handleChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formValue.amount < 1) {
      setFormError(`Payment Amount must be greater than $ 1.00`);
    } else {

      const transactionData = {
        user_id: userProfileData.id,
        recipient_name: formValue.member_name.split('-')[1].trim(),
        group_name: activeGroupDetails.name ? activeGroupDetails.name : formValue.group_name,
        transaction_type: 'Payment',
        amount: parseFloat(formValue.amount),
        is_deleted: false
      };
      axios
        .post('/api/transactions/', transactionData)
        .then((response) => {
          axios.get(`/api/transactions/${userProfileData.id}`)
            .then((res) => setTransactions(res.data))
            .then(useModalView.closeModal());
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    }
  };

  const filteredMembers = !activeGroupDetails.name && formValue.group_name ? memberNames.filter((name) => name.split(' -').includes(formValue.group_name)) : [];
  const displayNames = activeGroupDetails.name ? memberNames : filteredMembers;

  return (
    <form className='new-payment-form' autoComplete="off" onSubmit={handleSubmit}>
      
      {formError && <Alert severity="error" onClose={handleClose}>
        {formError}
      </Alert>}
      
      <TextField
        id='group-name'
        required
        select
        name="group_name"
        label="Group Name"
        value={activeGroupDetails.name ? activeGroupDetails.name : formValue.group_name}
        onChange={handleChange}
      >
        {groupNames.map((type, index) => (
          <MenuItem key={index} value={type}>{type}</MenuItem>
        ))}
      </TextField>

      <TextField
        id='member-name'
        required
        select
        name="member_name"
        label="Member Name"
        value={formValue.member_name}
        onChange={handleChange}
      >
        {displayNames.map((type, index) => (
          <MenuItem key={index} value={type}>{type}</MenuItem>
        ))}
      </TextField>

      <TextField
        id='amount'
        required
        type="text"
        name="amount"
        label="Payment Amount"
        value={formValue.amount}
        onChange={handleChange}
      />
      <div>
        <p className="logo" >DIVI</p>
      </div>
      <div className="buttons">
        <Button type="submit" className="create-payment-button" variant="contained" color="info">Post Payment</Button>
      </div>
    </form>
  );
};

export default AddPaymentForm;