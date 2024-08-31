import { Routes, Route } from "react-router-dom";
import UserHome from "../pages/user/UserHome";
import UserProfile from "../components/user/UserProfile";
import ProfileInfo from "../components/user/ProfileInfo";
import ClientJobProfile from "../pages/user/ClientJobProfile";
import JobApply from "../pages/user/JobApply";
import Navbar from "../components/main/Navbar";
import Footer from "../components/main/footer";
import { useSelector } from "react-redux";
import Notifications from "../pages/user/Notifications";
import ListedWork from "../pages/user/ListedWork";
import ContractPage from "../pages/user/ContractPage";
import ContractInfo from "../pages/user/ContractInfo";
import FindWork from "../pages/user/FindWork";
import Message from "../pages/user/Message";
import ViewProposal from "../pages/user/ViewProposal";
import ViewuserProfile from "../pages/user/ViewuserProfile";
import Star from "../pages/user/Star";
import NotFoundPage from "../pages/404/NotFoundPage ";

const UserRoute = () => {
  const user = useSelector((state) => state.persisted.user.user);

  return (
    <>

    <Navbar userType='user' userInfo={user}/>
      <Routes>           
        <Route path="/home" element={<UserHome />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profileInfo" element={<ProfileInfo />} />
        <Route path="/JobProfile/:id" element={<ClientJobProfile />} />
        <Route path="/applyNow/:id" element={<JobApply />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/contract/:id" element={<ContractPage />} />
        <Route path="/workList" element={<ListedWork />} />
        <Route path="/ContractInfo/:id" element={<ContractInfo />} />
        <Route path="/findwork" element={<FindWork />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/viewproposal/:id" element={<ViewProposal />} />
        <Route path="/viewprofile" element={<ViewuserProfile />} />
        <Route path="/rating/:id" element={<Star />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer/>
    </>
  );
};

export default UserRoute;
