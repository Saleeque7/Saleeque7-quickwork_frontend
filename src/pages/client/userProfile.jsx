import { useNavigate ,useParams} from "react-router-dom";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { useState, useEffect } from "react";
import UserData from "../../components/Client/UserData";
import { findUserByIdApi } from "../../utils/api/api";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const {id} =useParams()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await clientAxiosInstance.get(`${findUserByIdApi}?id=${id}`);
        console.log(res.data);
        if (res.data) {
          setUserData(res.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    if (id) {
      fetchUser();
    }
  }, [id]);
  

  return (
    <div className="p-10">
      <div className="px-10">
        <span
          onClick={() => {
            navigate(-1);
          }}
          className="hover:underline text-teal-600 cursor-pointer"
        >
         Go  Back
        </span>
      </div>
      <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex flex-col min-h-[60vh]">
        <UserData userData={userData}/>
      </div>
    </div>
  );
}
