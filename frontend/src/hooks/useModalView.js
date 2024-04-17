import React, { useState } from "react";

export default function useModalView() {
  const [profileView, setProfileView] = useState(false);
  const [newGroupView, setNewGroupView] = useState(false);
  const [deleteProfileView, setDeleteProfileView] = useState(false);
  // add new state here

  const closeModal = () => {
    setProfileView(false);
    setNewGroupView(false);
    setDeleteProfileView(false);
    // add new set false here
  }

  const openModal = (urlpath) => {
    if(urlpath === "profile") setProfileView(true)
    if(urlpath === "new-group") setNewGroupView(true)
    if(urlpath === "profile-delete") {
      setProfileView(false)
      setDeleteProfileView(true)
    }
    // add new path here to set true
  }


  return {
    profileView,
    newGroupView,
    deleteProfileView,
    // add new state view here
    closeModal,
    openModal
  };
}