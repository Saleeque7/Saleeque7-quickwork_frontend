import React from "react";

export default function UserJobProposal() {
  const profileImage = null;
  return (
    <div className="shadow-md p-4 rounded-md bg-white mb-4 text-left">
      <div className="flex items-center mb-8">
        {/* Left side: User photo */}
        <div className="mr-4 flex-shrink-0">
          <img
            src={profileImage || "https://via.placeholder.com/80"}
            alt="User Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
        </div>

        {/* Right side: User details */}
        <div>
          {/* User name and role */}
          <h3 className="font-bold text-gray-800">saleeque</h3>
          <p className="text-sm text-gray-500">FullStack developer</p>

          {/* Cover letter */}
          <p className="mt-2 text-gray-700">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
            harum eum possimus beatae quis eveniet nesciunt nihil optio nemo,
            quidem consequatur culpa expedita hic ducimus rem suscipit dicta
            dignissimos nam! Numquam itaque sunt id eveniet odio, eligendi eum
            quaerat reprehenderit perferendis ea cum fuga, pariatur doloribus
            natus vel, tempora accusantium? Voluptatum accusantium blanditiis
            dolorum labore consectetur adipisci velit veniam et. Incidunt,
            facere ea cumque veniam consequatur error! Dignissimos officia eos
            laudantium repellendus nihil asperiores dolores culpa nostrum
            praesentium sint delectus neque odit exercitationem, molestias
            dolorem vel iste voluptate est. Provident.
          </p>

          {/* Skills */}
          <p className="mt-2 text-sm text-gray-600">
            <strong>Skills:</strong> uniqueskill
          </p>

          {/* Hourly rate */}
          <p className="mt-2 text-sm text-gray-600">
            <strong>Hourly Rate:</strong> 100
          </p>

          {/* Buttons: Message and Hire */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="mr-2 px-4 py-2 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Message
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors cursor-pointer"
            >
              Hire
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {/* Left side: User photo */}
        <div className="mr-4 flex-shrink-0">
          <img
            src={profileImage || "https://via.placeholder.com/80"}
            alt="User Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
        </div>

        {/* Right side: User details */}
        <div>
          {/* User name and role */}
          <h3 className="font-bold text-gray-800">saleeque</h3>
          <p className="text-sm text-gray-500">FullStack developer</p>

          {/* Cover letter */}
          <p className="mt-2 text-gray-700">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
            harum eum possimus beatae quis eveniet nesciunt nihil optio nemo,
            quidem consequatur culpa expedita hic ducimus rem suscipit dicta
            dignissimos nam! Numquam itaque sunt id eveniet odio, eligendi eum
            quaerat reprehenderit perferendis ea cum fuga, pariatur doloribus
            natus vel, tempora accusantium? Voluptatum accusantium blanditiis
            dolorum labore consectetur adipisci velit veniam et. Incidunt,
            facere ea cumque veniam consequatur error! Dignissimos officia eos
            laudantium repellendus nihil asperiores dolores culpa nostrum
            praesentium sint delectus neque odit exercitationem, molestias
            dolorem vel iste voluptate est. Provident.
          </p>

          {/* Skills */}
          <p className="mt-2 text-sm text-gray-600">
            <strong>Skills:</strong> uniqueskill
          </p>

          {/* Hourly rate */}
          <p className="mt-2 text-sm text-gray-600">
            <strong>Hourly Rate:</strong> 100
          </p>

          {/* Buttons: Message and Hire */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="mr-2 px-4 py-2 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Message
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors cursor-pointer"
            >
              Hire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
