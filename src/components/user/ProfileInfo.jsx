import Navbar from "../main/Navbar";
import { MdCheckCircle } from 'react-icons/md';

export default function ProfileInfo() {
  return (
    <>
      <div>
        <Navbar />
        <div className="flex justify-center items-center flex-col md:flex-row p-5">
          <div className="w-full mb-8 md:mb-0 flex flex-col items-center p-8 mt-8 rounded-md text-center gap-4">
            <h1 className="text-3xl color-teal text-teal-700 font-bold italic">
              Thank You For Your Valuable Information. Please Verify Your Details
            </h1>
            <MdCheckCircle className="text-teal-600 text-[100px]" />
          </div>
        </div>
      </div>
    </>
  );
}
