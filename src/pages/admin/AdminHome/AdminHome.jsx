// src/pages/admin/AdminHome/AdminHome.jsx

import { Header } from "../../../components/admin/Header/Header";
import { Aside } from "../../../components/admin/Aside/Aside";
import AdminHomePage from "../../../components/admin/AdminHome/AdminHome";
import ListUsers from "../../../components/admin/Freelancers/ListUsers";
import ListClients from "../../../components/admin/Clients/ListClients";
import { Route, Routes } from "react-router-dom";
import { Transition } from "../../../components/uic/Animation/Animation";

export default function AdminHome() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Aside />
      <Header />
      <div className="ml-20 bg-white min-h-screen">
        <Transition>
          <Routes>
            <Route path="dashboard" element={<AdminHomePage />} />
            <Route path="freelancers" element={<ListUsers />} />
            <Route path="clients" element={<ListClients />} />
          </Routes>
        </Transition>
      </div>
    </div>
  );
}
