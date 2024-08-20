import { useEffect, useState } from "react";

const QuitContractModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }

    onConfirm(reason);
    setReason('')
    onClose();
  };

  useEffect(()=>{
setTimeout(()=>{
    setError('');

},1000)
  },[error])

  const handleChange = (e) => {
    setReason(e.target.value);
    if (e.target.value.trim()) {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 w-full max-w-2xl rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Confirm Quit Contract</h2>
        <textarea
          className="w-full p-4 h-40 border rounded-lg mb-2"
          placeholder="Please provide a reason for quitting the contract"
          value={reason}
          onChange={handleChange}
        ></textarea>
        {error && <p className="text-red-500 mb-6">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 mr-4 bg-gray-300 text-lg rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuitContractModal;
