import { useSelector } from "react-redux";
import WeeklyRevenueChart from "../Charts.jsx/Charts";
import { useEffect, useState } from "react";
import { adminAxiosInstance } from "../../../utils/api/privateAxios";
import { adminDataApi, collectClientsDataApi, collectUserDataApi } from "../../../utils/api/api";

export default function AdminHomePage() {
  const admin = useSelector((state) => state.persisted.admin.admin);
  const [adminData, setAdminData] = useState(null);
  const [users, setUsers] = useState(null);
  const [clients, setClients] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [adminRes, clientsRes, usersRes] = await Promise.all([
          adminAxiosInstance.get(adminDataApi),
          adminAxiosInstance.get(collectClientsDataApi),
          adminAxiosInstance.get(collectUserDataApi)
        ]);
        
        setAdminData(adminRes.data);
        setClients(clientsRes.data.clients);
        setUsers(usersRes.data.users);
        setChartData(adminRes.data.chartData || []); 
      } catch (err) {
        console.error("Error fetching data", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center p-12 text-gray-500 font-semibold">Loading...</p>;
  }

  if (error) {
    return <p className="text-center p-12 text-red-500 font-semibold">Error loading data</p>;
  }

  return (
    <div className="p-6 text-left w-full bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">₹ {adminData?.wallet?.balance || "N/A"}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{users?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Clients</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{clients?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Contracts</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">25</p> 
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6 w-full">
        <WeeklyRevenueChart data={chartData} />
      </div>
    </div>
  );
}
