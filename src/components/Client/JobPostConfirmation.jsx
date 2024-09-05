import React from 'react'

export default function JobPostConfirmation({isOpen ,onClose , onConfirm}) {

    if(!isOpen) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-lg font-semibold">close Jobpost</h2>
      <p className="mt-2">Are you sure you want to close this job?</p>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onConfirm}
        >
          confirm
        </button>
      </div>
    </div>
  </div>
  )
}
