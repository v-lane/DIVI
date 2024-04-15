import React from 'react';

import '../styles/UserProfile.scss';

import { Button } from "@mui/material";


const UserProfile = (props) => {
  const { userProfileData } = props;

  return (
    ( userProfileData && 

    <section className='user-profile'>
      <table>
        <tbody>

          <tr>
            <th>Username:</th>
            <td>{userProfileData.username}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{userProfileData.email}</td>
          </tr>
        </tbody>
      </table>
      <footer>
        <Button className="profile-button" variant="contained" color="info">Edit</Button>
        <Button className="profile-button" variant="contained" color="error">Delete</Button>
      </footer>
    </section>
    )
  );
};

export default UserProfile;