import { Routes, Route } from "react-router-dom";
import ClientHome from "../pages/client/ClientHome";
import PostJobs from  "../pages/client/Addjob/PostJobs"
import Joblisted from "../pages/client/Joblisted";
import ListedJobs from '../pages/client/ListedJobs'
import UserList from "../pages/client/UserList";
import UserProfile from "../pages/client/userProfile";
import OfferLetter from "../pages/client/OfferLetter";
import Hire from "../pages/client/Hire";
import Navbar from "../components/main/Navbar";
import Footer from "../components/main/footer";
import ViewContract from "../pages/client/ViewContract";
import Message from "../pages/client/Message";
import JobPostForm from "../pages/client/JobEdit";
import Bills from "../pages/client/Bills";
import SuccessPage from "../pages/client/SuccessPage"
import CancelPage  from "../pages/client/CancelPage"
import ViewSubmittedContract from "../pages/client/ViewSubmittedContract";
import { useSelector } from "react-redux";
const ClientRoute = () => {
  const client = useSelector((state) => state.persisted.client.client);

  return (
    <>
    <Navbar userType='client' userInfo={client}/>
  
      <Routes>     
      <Route path="/home" element={<ClientHome />} />      
      <Route path="/postJob" element={<PostJobs />} />  
      <Route path="/listjobs/:id" element={<ListedJobs />} />
      <Route path="/joblisted" element={<Joblisted />} />    
      <Route path="/UserList" element={<UserList />} />    
      <Route path="/userProfile/:id" element={<UserProfile />} />    
      <Route path="/offerLetter/:jobId/:proposalId" element={<OfferLetter />} />    
      <Route path="/hire/:jobId/:proposalId/:contractId" element={<Hire />} />  
      <Route path="/viewContract/:id" element={<ViewContract />} />
      <Route path="/messages" element={<Message />} />
      <Route path="/jobForm/:action/:jobId" element={<JobPostForm />} />
      <Route path="/Bills" element={<Bills />} />
      <Route path="/success/:id" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/viewSubmitted/:id" element={<ViewSubmittedContract />} />
      </Routes>
      <Footer/>
    </>
  );
};

export default ClientRoute;
