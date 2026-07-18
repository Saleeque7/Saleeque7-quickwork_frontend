import { useState, useEffect } from "react";
import { adminAxiosInstance } from "../../../utils/api/privateAxios";
import { collectClientsDataApi } from "../../../utils/api/api";
import { blockClientApi, unblockClientApi } from "../../../utils/api/api";

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

  const BlockClient = async (clientId) => {
    try {
      const response = await adminAxiosInstance.put(
        `${blockClientApi}?id=${clientId}`
      );
      const updatedClient = response.data.client;

      setclients((prevClients) =>
        prevClients.map((client) =>
          client._id === updatedClient._id ? updatedClient : client
        )
      );
    } catch (error) {
      console.error("Error blocking user", error);
    }
  };

  const UnblockClient = async (clientId) => {
    try {
      const response = await adminAxiosInstance.put(
        `${unblockClientApi}?id=${clientId}`
      );
      const updatedClient = response.data.client;

      setclients((prevClients) =>
        prevClients.map((client) =>
          client._id === updatedClient._id ? updatedClient : client
        )
      );
    } catch (error) {
      console.error("Error blocking user", error);
    }
  };

  return (
    <div className="p-6 text-left w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6 w-full">
        <div className="mb-4 flex justify-end">
          <div>
            <input
              type="text"
              placeholder="Search...."
              className="border border-gray-300 rounded px-4 py-2 w-64 focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          <div className="grid grid-cols-5 bg-gray-50 p-4 font-semibold text-gray-600 border-b border-gray-200">
            <div>Client</div>
            <div>Email</div>
            <div>Contact Info</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {clients.map((client) => (
            <div
              className="grid grid-cols-5 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center"
              key={client._id}
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    client?.profile?.location || client?.profile
                      ? client?.profile?.location || client?.profile
                      : ""
                  }
                  alt=""
                  className="w-10 h-10 rounded-full object-cover bg-gray-100"
                />
                <p className="font-medium text-gray-800">
                  {client.name ? client.name : ""}
                </p>
              </div>
              <div className="text-gray-600 truncate pr-2">
                {client.email ? client.email : ""}
              </div>
              <div className="text-gray-600">
                {client.phone ? client.phone : ""}
              </div>
              <div>
                {client.isBlock ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    InActive
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
              <div>
                {!client.isBlock ? (
                  <button
                    onClick={() => BlockClient(client._id)}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors cursor-pointer"
                  >
                    Block
                  </button>
                ) : (
                  <button
                    onClick={() => UnblockClient(client._id)}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors cursor-pointer"
                  >
                    UnBlock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
