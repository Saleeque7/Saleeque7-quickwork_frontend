import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const user = useSelector((state) => state.persisted.user.user);
  
  const [userProfile, setUserProfile] = useState(false); 
  const [clientProfile, setclientProfile] = useState(true); 
  const [isStart, setIsStart] = useState(false);

  return (
    <ProfileContext.Provider value={{ userProfile, setUserProfile, isStart, setIsStart,clientProfile, setclientProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(ProfileContext);
