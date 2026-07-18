import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/uic/Logo";
import { MdBusiness, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function PreAuth() {
  const [selectedBox, setSelectedBox] = useState();
  const navigate = useNavigate();
  const handleBoxClick = (boxName) => {
    setSelectedBox(boxName);
  };

  const handlepreAUth = () => {
    const job_role = selectedBox === 'boxA' ? 'client' : 'freelancer';
    if(job_role){
      navigate('/register', { state: { userType: job_role } });
    }
    return job_role;
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 border-b border-gray-150">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="max-w-md mx-auto w-full py-12 px-4 sm:px-6">
        <div className="flex flex-col gap-8 bg-white border border-gray-200/80 shadow-xl rounded-[32px] p-8 sm:p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Join as a client or freelancer
            </h1>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex justify-between gap-4">
              <div
                onClick={() => handleBoxClick("boxA")}
                className={`w-[48%] p-5 flex flex-col items-start relative border rounded-2xl cursor-pointer transition-all ${
                  selectedBox === "boxA"
                    ? "border-green-600 border-2 bg-green-50/20"
                    : "border-gray-250 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <MdBusiness className="text-3xl text-green-600" />
                  <span className="text-sm font-bold text-gray-800 text-left">
                    I’m a client, hiring for a project
                  </span>
                </div>
                {selectedBox === "boxA" && (
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="absolute top-3 right-3 accent-green-600 h-4 w-4 cursor-pointer"
                  />
                )}
              </div>

              <div
                onClick={() => handleBoxClick("boxB")}
                className={`w-[48%] p-5 flex flex-col items-start relative border rounded-2xl cursor-pointer transition-all ${
                  selectedBox === "boxB"
                    ? "border-green-600 border-2 bg-green-50/20"
                    : "border-gray-250 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <MdPerson className="text-3xl text-green-600" />
                  <span className="text-sm font-bold text-gray-800 text-left">
                    I’m a freelancer, looking for work
                  </span>
                </div>
                {selectedBox === "boxB" && (
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="absolute top-3 right-3 accent-green-600 h-4 w-4 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={selectedBox ? handlepreAUth : undefined}
              disabled={!selectedBox}
              className={`w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-sm hover:shadow cursor-pointer text-sm ${
                !selectedBox ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {selectedBox === "boxB"
                ? "Apply as a freelancer"
                : selectedBox === "boxA"
                ? "Join as a client"
                : "Register"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-200/50 mt-10">
        <p className="text-xs text-gray-400">© 2026 QUICKWORK Inc. All rights reserved.</p>
      </div>
    </div>
  );
}

export default PreAuth;
