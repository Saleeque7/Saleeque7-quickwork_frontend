
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const UserProtectedRoute = () => {
  const isUserAuth = useSelector((state) => state.persisted.user.isAuthenticated);
  return (
    isUserAuth ? <Outlet/> : <Navigate to='/login'/>
  )
};

export const ClientProtectedRoute = () => {
  const isClientAuth = useSelector((state) => state.persisted.client.isClientAuthenticated);

  return (
    isClientAuth ? <Outlet/> : <Navigate to='/login'/>
  )
};

export const AdminProtectedRoute = () => {
  const isAdminAuth = useSelector((state) => state.persisted.admin.isadminAuthenticated);

  return (
    isAdminAuth ? <Outlet/> : <Navigate to='/adminLogin'/>
  )
};



export const ProtectedRoute = () => { 

  const isUserAuth = useSelector((state) => state.persisted.user.isAuthenticated);
  const isClientAuth = useSelector((state) => state.persisted.client.isClientAuthenticated);
  if(isClientAuth){
  return <Navigate to="/client/home" />;
  }else if(isUserAuth){
    return <Navigate to="/user/home" />;
  }
  else{
    return <Outlet />;
  }
};


export const AdminPublicRoute = () => { 
  const isAdminAuth = useSelector((state) => state.persisted.admin.isadminAuthenticated);
  if(isAdminAuth){
    return <Navigate to="/admin/dashboard" />;
  }else{
    return <Outlet />;
  }
};


// if(isAdminAuth){
// }else 
// else if(isClientAuth){
// }