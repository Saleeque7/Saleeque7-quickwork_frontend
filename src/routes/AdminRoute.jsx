import {Routes , Route } from "react-router-dom";
import AdminHome from "../pages/admin/AdminHome/AdminHome";
import NotFoundPage from "../pages/404/NotFoundPage ";

const AdminRoute = () => {
    return (
      <>
        <Routes>     
        <Route path="/*" element={<AdminHome />} />
        <Route path="*" element={<NotFoundPage />} />

        </Routes> 
      </>
    );
  };
  
  export default AdminRoute;
  

