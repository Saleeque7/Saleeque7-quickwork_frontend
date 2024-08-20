import { useNavigate } from "react-router-dom";
import { userProfileApi } from "../../utils/api/api";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { useState, useEffect } from "react";
import EditableProfile from "../../components/user/EditableProfile";

export default function ViewUserProfile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAxiosInstance.get(userProfileApi);
        console.log(res.data);
        if (res.data) {
          setUserData(res.data);
        }
      } catch (error) {
        console.error(error, "error in fetch userData");
      }
    };
    fetchUser();
  }, []); 

  return (
    <div className="p-10">
      <div className="px-10">
        <span
          onClick={() => {
            navigate(-1);
          }}
          className="hover:underline text-teal-600 cursor-pointer"
        >
          Back to Home
        </span>
      </div>
      <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex flex-col min-h-[60vh]">
        <EditableProfile userData={userData} setUserData={setUserData} />
      </div>
    </div>
  );
}
