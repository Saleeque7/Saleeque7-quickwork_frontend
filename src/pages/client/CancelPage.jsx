import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 py-8">
      <FaTimesCircle className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold mb-2 text-red-500">Payment Canceled</h1>
      <p className="text-lg text-center mb-6 font-semibold">
        Your Payment has been  canceled.
      </p>
      <hr className="mb-4 w-1/2 border-gray-300" />



      <button
        onClick={() => navigate('/')}
        className="bg-red-500 text-white py-2 px-4 rounded mt-6 hover:bg-red-600"
      >
        Go to Home
      </button>
    </div>
  );
}
