import React, {useState} from "react";
import axios from 'axios'
import { Button } from "@mui/material";
import '/src/styles/EditUserForm.scss'

const EditUserForm = (props) => {
  const {userProfileData, cancelDelete, useModalView } = props;

  const [formValue, setFormValue] = useState({
    userName: userProfileData.username,
    email: userProfileData.email
  });

  const handleChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      username: formValue.userName,
      email: formValue.email,
      id: userProfileData.id
    };
    axios
      .patch(`/api/users/${userProfileData.id}/`, userData)
      .then((res) => console.log(res.data))
      .then(useModalView.closeModal())

  };

  return (
    <>
    <form className="edit-form" onSubmit={handleSubmit}>
      <div className="input-canvas">
      <div className="inputs">
        <div className="input">
          <label>Username: </label>
          <input type="text" className="form-control" name="userName" id="updated-username" onChange={handleChange} value={formValue.userName}></input>
        </div>
        <div className="input">
          <label>Email: </label>
          <input type="text" className="form-control" name="email" id="updated-email" onChange={handleChange} value={formValue.email}></input>
        </div>
      </div>
      </div>
      <div className='buttons'>
        <Button className="button" variant="contained" color="info" onClick={cancelDelete}>Cancel</Button>
        <Button type="submit" className="button" variant="contained" color="info">Confirm</Button>
      </div>
    </form>
    </>
  )
};

export default EditUserForm;