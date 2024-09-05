import { useCallback, useEffect, useState } from "react";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { fetchTransactionsApi, fetchWalletApi } from "../../utils/api/api";
import { MdCurrencyRupee } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";

export default function Bills() {
  const [activeTabs, setActiveTabs] = useState("Wallet Transaction");
  const [transactions, setTransactions] = useState([]);
  const [walletInfo, setwalletInfo] = useState([]);
  const [searchQueryTransaction, setSearchQueryTransaction] = useState("");
  const [currentPageTransaction, setCurrentTransaction] = useState(1);
  const [totalPagesTransaction, setTotalPagesTransaction] = useState(1);
   const [balance ,setbalance] = useState("")


  const fetchTransactionInfo = useCallback(
    debounce(async (query, page = 1, limit = 5) => {
      try {
        const res = await clientAxiosInstance.get(fetchTransactionsApi, {
          params: { searchQuery: query, page, limit },
        });
        console.log(res.data, "transaction");
        if (res.data) {
          setTransactions(res.data.transaction || []);
          setTotalPagesTransaction(res.data.Pages || 1);
        }
      } catch (error) {
        console.error(error, "error in fetching transaction info");
      }
    }, 500),
    [clientAxiosInstance, setTransactions, setTotalPagesTransaction]
  );
  
  const fetchWalletInfo = useCallback(
    debounce(async (query, page = 1, limit = 5) => {
      try {
        const res = await clientAxiosInstance.get(fetchWalletApi, {
          params: { searchQuery: query, page, limit },
        });
        console.log(res.data, "wallet");
        if (res.data) {
          setbalance(res.data.balance);
          setwalletInfo(res.data.transaction || []);
          setTotalPagesTransaction(res.data.Pages || 1);
        }
      } catch (error) {
        console.error(error, "error in fetching wallet info");
      }
    }, 500),
    [clientAxiosInstance, setbalance, setwalletInfo, setTotalPagesTransaction]
  );
  
  useEffect(() => {
    if (activeTabs === "Payment History") {
      fetchTransactionInfo(searchQueryTransaction, currentPageTransaction);
    }
  
    if (activeTabs === "Wallet Transaction") {
      fetchWalletInfo(searchQueryTransaction, currentPageTransaction);
    }
  
    return () => {
      // Cleanup debounce
      fetchTransactionInfo.cancel();
      fetchWalletInfo.cancel();
    };
  }, [activeTabs, searchQueryTransaction, currentPageTransaction]);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPagesTransaction) {
      setCurrentTransaction(page);
    }
  };

  return (
    <div className="p-10  bg-gray-100">
      <section className="p-1">
        <div className="flex justify-between items-center p-3">
          <nav>
            <ul className="flex">
              <li className="mr-4 font-semibold">
                <button
                  className={`${
                    activeTabs === "Wallet Transaction"
                      ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                      : "text-gray-500"
                  } px-2 py-1`}
                  onClick={() => setActiveTabs("Wallet Transaction")}
                >
                  Wallet Transaction
                </button>
              </li>
              <li className="mr-4 font-semibold">
                <button
                  className={`${
                    activeTabs === "Payment History"
                      ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                      : "text-gray-500"
                  } px-2 py-1`}
                  onClick={() => setActiveTabs("Payment History")}
                >
                  Payment History
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <hr className="w-full border-t-1 border-gray-500 mb-12" />

        {activeTabs === "Wallet Transaction" && (
          <div className="px-10 min-h-[70vh]">
            <h2 className="text-2xl font-semibold mb-6">Wallet Transactions</h2>

            <div className="mb-4">
              <p className="text-gray-800 font-semibold flex items-center">
                Total Balance:
                <span className="text-green-500 flex items-center ml-2">
                  <MdCurrencyRupee className="text-lg" />
                  {balance}
                </span>
              </p>
            </div>
            

            {walletInfo.length > 0 ? (
              <div className="space-y-4 ">
                {walletInfo.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {transaction.source} - {transaction.status}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <p
                      className={`flex items-center ${
                        transaction.status === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      } text-lg font-bold`}
                    >
                      <MdCurrencyRupee className="text-lg mr-1" />
                      {transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 flex text-center justify-center mt-6">
                No wallet transactions available.
              </p>
            )}
              <div className="flex justify-center mt-8">
              {Array.from({ length: totalPagesTransaction }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 mx-1 border rounded-lg ${
                    currentPageTransaction === i + 1
                      ? "bg-teal-700 text-white"
                      : "text-teal-700 bg-white hover:bg-teal-100"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTabs === "Payment History" && (
          <div className="px-10 min-h-[70vh]">
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-2xl text-teal-700 font-semibold">
                Payment History
              </h2>
              {/* <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden w-1/2">
                <input
                  aria-label="Search"
                  placeholder="Search"
                  type="search"
                  className="px-4 py-2 outline-none w-full rounded-l-xl"
                  onChange={(e) => setSearchQueryTransaction(e.target.value)}
                />
                <FaSearch className="text-gray-500 mx-2" />
              </div> */}
            </div>

            {transactions.length > 0 ? (
              <div className="min-h-[50vh]">
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <p className="text-gray-700 font-semibold">Payment Date</p>
                  <p className="text-gray-700 font-semibold">Payment ID</p>
                  <p className="text-gray-700 font-semibold">Method</p>
                  <p className="text-gray-700 font-semibold">Source</p>
                  <p className="text-gray-700 font-semibold">Amount</p>
                </div>

                <div className="space-y-6">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="bg-white shadow-sm rounded-lg p-4 grid grid-cols-5 gap-4"
                    >
                      <p className="text-gray-600 text-sm">
                        {transaction?.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {transaction.Transaction_id}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {transaction.payment_method}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {transaction.source}
                      </p>
                      <p className="flex items-center text-teal-700 text-lg font-bold">
                        <MdCurrencyRupee className="text-md" />
                        {transaction.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center mt-6">
                No payment history available.
              </p>
            )}

            <div className="flex justify-center mt-8">
              {Array.from({ length: totalPagesTransaction }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 mx-1 border rounded-lg ${
                    currentPageTransaction === i + 1
                      ? "bg-teal-700 text-white"
                      : "text-teal-700 bg-white hover:bg-teal-100"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
