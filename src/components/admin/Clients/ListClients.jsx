import { useState, useEffect } from "react";
import { adminAxiosInstance } from "../../../utils/api/privateAxios";
import { collectClientsDataApi } from "../../../utils/api/api";
import { blockClientApi ,unblockClientApi } from "../../../utils/api/api";
import  './listClients.scss'


export default function ListClients() {


  const [clients, setclients] = useState([]);

  useEffect(() => {
    const fetchclients = async () => {
      try {
        const response = await adminAxiosInstance.get(collectClientsDataApi);
        console.log(response.data);
        setclients(response.data.clients);
      } catch (error) {
        console.error("Error fetching client data", error);
      }
    };
    fetchclients();
  }, []);


  const BlockClient= async(clientId)=>{
    try {
      const response = await adminAxiosInstance.put(`${blockClientApi}?id=${clientId}`);
      const updatedClient = response.data.client; 
  
      setclients((prevClients) =>
        prevClients.map((client) =>
          client._id === updatedClient._id ? updatedClient : client
        )
      );

    } catch (error) {
      console.error("Error blocking user", error);
    }
  }

  const UnblockClient =async(clientId)=>{
    try {
      const response = await adminAxiosInstance.put(`${unblockClientApi}?id=${clientId}`);
      const updatedClient = response.data.client; 
  
      setclients((prevClients) =>
        prevClients.map((client) =>
          client._id === updatedClient._id ? updatedClient : client
        )
      );

    } catch (error) {
      console.error("Error blocking user", error);
    }
  }

  return (
    <div className="main-class">
      <div className="user-Head">
        <h1>Clients</h1>      
      </div>
    <div className="temp-list-main">
      <div className="search-inner">
        <div className="search-box">
          <input type="text" placeholder="Search...." />
        </div>
      </div>

      <div className="table-main">
        <div className="inner-table">
          <div className="column">Client</div>
          <div className="column">Email</div>
          <div className="column">Contact Info</div>
          <div className="column">Status</div>
          <div className="column">Action</div>
        </div>

        {clients.map((client) => (
          <div className="loop-row" key={client._id}>
            <div className="column">
              <div className="img-2">
                <img src={client?.profile?.location || client?.profile  ? client?.profile?.location || client?.profile :"" } alt="" />
                <p>{client.name ?client.name :""}</p>
              </div>
            </div>
            <div className="column">{client.email ? client.email :""}</div>
            <div className="column">{client.phone ? client.phone :""}</div>
            <div className="column">
             { client.isBlock ?
              <span className="span_1">InActive</span>
              :
              <span>Active</span>
            }
            </div>
            <div className="column">
             { !client.isBlock ?<button onClick={()=> BlockClient(client._id)}>Block</button>
             :
              <button className="un-block" onClick={()=>UnblockClient(client._id)}>UnBlock</button>}
            </div>
          </div>
         ))} 
      </div>
    </div>
    </div>
  )
}
