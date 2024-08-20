import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Divider } from "@chakra-ui/react";
import { MdCurrencyRupee } from "react-icons/md";
import { SiRazorpay, SiStripe } from "react-icons/si";
import Logo from "../../assets/logo.png";
import { config } from "../../config/config";
import {
  browseOfferletter,
  saveAddressApi,
  paymentApi,
  verifypaymentApi,
  paymentAfterEditApi,
  stripePaymentApi
} from "../../utils/api/api";
import { setClient } from "../../utils/Redux/recruiterSlice";
import { clientAxiosInstance, userAxiosInstance } from "../../utils/api/privateAxios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {loadStripe} from '@stripe/stripe-js';
import axios from "axios";

export default function Hire() {
  const client = useSelector((state) => state.persisted.client.client);
  const dispatch = useDispatch()
  const { jobId, proposalId, contractId } = useParams();
  const navigate = useNavigate();
  const [jobinfo, setJobinfo] = useState("");
  const [proposalInfo, setProposalInfo] = useState("");
  const [address, setaddress] = useState( client?.Address?.address || "");
  const [state, setstate] = useState( client?.Address?.state ||"");
  const [city, setCity] = useState( client?.Address?.city || "");
  const [postal, setPostal] = useState( client?.Address?.postalCode  || "");

  const [addressInfo, setAddressInfo] = useState(null);

  const subtotal = proposalInfo?.bidAmount;
  const contractInitiationFee = subtotal * 0.1;
  const estimatedTotal = subtotal + contractInitiationFee;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jobId && proposalId) {
          const url = `${browseOfferletter}?jobid=${jobId}&proposalId=${proposalId}`;
          const response = await clientAxiosInstance.get(url);
          if (response.status === 200) {
            setJobinfo(response.data.jobInfo);
            setProposalInfo(response.data.proposalInfo);
          } else {
            console.error("Failed to fetch offer letter details");
          }
        } else {
          console.error("jobId or proposalId is undefined");
        }
      } catch (error) {
        console.error(error, "error in fetching offerletter details");
      }
    };
    fetchData();
  }, [jobId, proposalId]);

  const SaveAddress = async () => {
    try {
      const data = {
        address,
        city,
        state,
        postal,
      };
      const response = await clientAxiosInstance.post(saveAddressApi, data);
      console.log(response.data);
      if (response.data) {
        dispatch(setClient(res.data))
        setaddress("");
        setstate("");
        setCity("");
        setPostal("");
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      throw new Error("Error submitting job. Please try again.");
    }
  };

  const [loading, setLoading] = useState(false);
  const [stripeloading, setstripeLoading] = useState(false);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const HandlePayment = async () => {
    setLoading(true);
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      const totalAmount = estimatedTotal;
      const result = await clientAxiosInstance.post(paymentApi, {
        amount: totalAmount,
      });

      if (!result.data) {
        toast.error("Server error. Please try again.", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }
      console.log(result.data,"resultdata");
      

      const { amount, id: order_id, currency } = result.data;
    

      const walletdata = {
        paymentId:order_id,
        contractAmount: subtotal,
        initiationfee: contractInitiationFee,
        contractId: contractId,
      };

      const options = {
        key: config.RAZORPAY_ID_KEY,
        amount: amount.toString(),
        currency: currency,
        name: "QuickWork",
        description: "QuickWork Wallet Transaction",
        image: Logo,
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const verifyResult = await clientAxiosInstance.post(
            verifypaymentApi,
            data
          );

          if (verifyResult.status === 200) {
            console.log(walletdata, "indaaa");
            const res = await clientAxiosInstance.post(
              `${paymentAfterEditApi}?contratid=${contractId}`,
              {
                data: walletdata,
              }
            );
            if (res.status === 200) {
              toast.success("Payment successful!", {
                autoClose: 1000,
                closeButton: true,
                draggable: true,
              });
              console.log(res.data, "payment data");
              const successId = res.data
              setTimeout(() => {
                navigate(`/client/success/${successId}`);
              }, 2000);
            } else {
              toast.error(" after payment has error.", {
                autoClose: 1000,
                closeButton: true,
                draggable: true,
              });
            }
          } else {
            toast.error("Payment verification failed. Please try again.", {
              autoClose: 1000,
              closeButton: true,
              draggable: true,
            });
          }
        },
        prefill: {
          name: proposalInfo?.freelancerId?.name,
          email: proposalInfo?.freelancerId?.email,
          contact: proposalInfo?.freelancerId?.phone,
        },
        notes: {
          address: client.email,
        },
        theme: {
          color: "#00756F",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error in Razorpay implementation:", error);
      toast.error("Payment processing error. Please try again.", {
        autoClose: 1000,
        closeButton: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  

  const HandleStripePayment = async () => {
    setstripeLoading(true);
    try {
      const stripe = await loadStripe(config.VITE_STRIPE_PUB_KEY);
  
      const totalAmountInINR = estimatedTotal;
  
      
      const exchangeRateResponse = await axios.get(`https://v6.exchangerate-api.com/v6/126fe505134306184c898cfa/pair/INR/USD`);
      const exchangeRate = exchangeRateResponse.data.conversion_rate;
  
      
      const totalAmountInUSD = totalAmountInINR * exchangeRate;
  
      const customerDetails = {
        name: client.name,
        address: {
          address: address,
          state: state,
          city: city,
          postal: postal,
          country: 'IN',
        },
      };
  
      const response = await clientAxiosInstance.post(stripePaymentApi, {
        amount: totalAmountInUSD,
        amountInINR: totalAmountInINR,  
        customerDetails: customerDetails,
        contractId:contractId,
        initiationfee: contractInitiationFee,
      });
  
      if (!response.data || !response.data.sessionId) {
        throw new Error("Failed to create Stripe payment session");
      }
  
      
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
  
      if (result.error) {
        console.error("Stripe redirect error:", result.error.message);
        toast.error("Stripe checkout error. Please try again.", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error in Stripe payment process:", error);
      toast.error("Payment processing error. Please try again.", {
        autoClose: 1000,
        closeButton: true,
        draggable: true,
      });
    } finally {
      setstripeLoading(false);
    }
  };

  
  return (
    <>
      <div className="p-10 ">
        <div className="flex font-semibold text-5xl m-10 mb-5 text-teal-600">
          Hire {proposalInfo?.freelancerId?.name || "saleeque"}
        </div>
        <div className="px-10 ">
          <span
            onClick={() => {
              navigate(-1);
            }}
            className=" hover:underline text-teal-600"
          >
            Back to offer page
          </span>
        </div>
        <div className="border-2 border-gray-200 m-10 rounded-xl p-10 py-20 flex">
        {client?.Address?.address ? (
        <div className="w-8/12 pr-10">
          <div className="m-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <p>{client.Address.address}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">City</h3>
              <p>{client.Address.city}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">State</h3>
              <p>{client.Address.state}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Postal Code</h3>
              <p>{client.Address.postalCode}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-8/12 pr-10">
          <div className="text-3xl font-semibold mb-5">
            1. Add company address
          </div>
          <section className="p-1">
            <div className="m-5">
              <div className="mb-5">
                <label className="block mb-2 font-medium">Address</label>
                <input
                  type="text"
                  className="border p-2 rounded-md w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex mb-5">
                <div className="mb-2 w-1/2">
                  <label className="block mb-1 font-medium">State</label>
                  <input
                    type="text"
                    className="border p-2 rounded-md w-full"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>

                <div className="mb-2 pl-2 w-1/2">
                  <label className="block mb-1 font-medium">City</label>
                  <input
                    type="text"
                    className="border p-2 rounded-md w-full"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-medium">Postal code</label>
                <input
                  type="text"
                  className="border p-2 rounded-md w-1/2"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                />
              </div>
              <button
                onClick={SaveAddress}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                Save
              </button>
            </div>
          </section>
        </div>
      )}

          <div>
            <hr className="h-full bg-gray-200" style={{ width: "2px" }} />
          </div>

          <div className="w-4/12 mx-5">
            <div className="mx-4">
              <div className="p-5 border rounded-lg shadow-lg w-full">
                <div className="flex items-center mb-4">
                  <img
                    src={proposalInfo?.freelancerId?.profile?.location}
                    alt={proposalInfo?.freelancerId?.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="ml-8">
                    <h2 className="text-lg text-teal-600 font-bold">
                      {proposalInfo?.freelancerId?.name}
                    </h2>
                    <p className="text-sm text-teal-600">
                      {proposalInfo?.freelancerId?.jobTitle}
                    </p>
                  </div>
                </div>
                <Divider className="my-4" />

                <div className="py-4">
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-xl text-gray-700">
                      QW Wallet Deposit
                    </h1>
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span className="flex items-center">
                          <MdCurrencyRupee />
                          {subtotal}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Contract Initiation Fee (10%)</span>
                        <span className="flex items-center">
                          <MdCurrencyRupee />
                          {contractInitiationFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Estimated Total</span>
                        <span className="flex items-center">
                          <MdCurrencyRupee />
                          {estimatedTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end my-5 space-y-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-500 mr-4 font-semibold ">
                      Pay with Razorpay
                    </span>
                    <button
                      className="bg-teal-600 text-white px-3 py-1 border border-gray-400 rounded hover:bg-teal-900 flex items-center"
                      onClick={HandlePayment}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-pulse rounded-full h-3 w-3 bg-teal-500 mr-2"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <span className="flex items-center">
                          <SiRazorpay className="text-white mr-2" />
                          Pay Now
                        </span>
                      )}
                    </button>
                  </div>

                 
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-500 mr-4 font-semibold">Pay with Stripe</span>
                    <button
                      className="bg-teal-600 text-white px-3 py-1 border border-gray-400 rounded hover:bg-teal-900 flex items-center"
                      onClick={HandleStripePayment} 
                      disabled={stripeloading}
                    >
                      {stripeloading ? (
                        <div className="flex items-center">
                          <div className="animate-pulse rounded-full h-3 w-3 bg-teal-500 mr-2"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <span className="flex items-center">
                          <SiStripe className="text-white mr-2" />{" "}
                          Pay Now
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
