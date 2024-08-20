import "./AdminHomePage.scss";
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data</p>;
  }

  return (
    <div className="home-div">
      <div className="top-wraps">
        <div className="wrap">
          <h3>Revenue</h3>
          <p>{adminData?.wallet?.balance || 'N/A'}</p>
        </div>
        <div className="wrap">
          <h3>Total Users</h3>
          <p>{users?.length || 0}</p>
        </div>
        <div className="wrap">
          <h3>Total Clients</h3>
          <p>{clients?.length || 0}</p>
        </div>
        <div className="wrap">
          <h3>Total Contracts</h3>
          <p>25</p> 
        </div>
      </div>
      <div className="chart-container">
        <WeeklyRevenueChart data={chartData} />
      </div>
    </div>
  );
}
