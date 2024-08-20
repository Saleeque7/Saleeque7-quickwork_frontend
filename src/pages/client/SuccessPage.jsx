import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate , useParams } from 'react-router-dom';
import { clientAxiosInstance } from '../../utils/api/privateAxios';
import { browseTransaction } from '../../utils/api/api';

export default function SuccessPage() {
  const navigate = useNavigate();
const {id} = useParams()
const [payment ,setPayment]  = useState(null)
useEffect(()=>{
  const fetchTransactionInfo = async()=>{
    try {
      const res = await clientAxiosInstance.get(`${browseTransaction}?id=${id}`);
      console.log(res.data);
      
      setPayment(res.data);
    } catch (error) {
      console.error(error,"error in fetchinf transaction data");
      
    }
  }
  fetchTransactionInfo()
},[id])


  const billDetails = {
    orderNumber: '123456789',
    amount: '$150.00',
    date: 'August 15, 2024',
    paymentMethod: 'Credit Card',
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 ">
      <FaCheckCircle className="text-green-500 w-16 h-16 mb-2" />
      <h1 className="text-2xl font-bold mb-1 text-green-500">Success!</h1>
      <p className="text-lg text-center mb-4 font-semibold">
        Your Transaction was completed successfully.
      </p>
      <hr className="mb-3 w-1/2 border-gray-300" />

      <div className="text-left w-full max-w-2xl p-4 bg-white rounded-lg">
        <div className="flex justify-between mb-2 font-extralight">
          <p>{payment?.Transaction_id || ""}</p>
          <p>{payment?.amount || ""}</p>
          <p>{payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString() : ""}</p>
          <p>{payment?.payment_method || ""}</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/client/home')}
        className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
