import { differenceInYears } from "date-fns";
import Rating from "../uic/Rating";
export default function UserData({ userData }) {
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    return differenceInYears(today, birth);
  };
  const reviews = [4, 5, 2, 4];
  const userDatas = {
    name: "Sahal",
    jobTitle: "Fullstack Developer",
    hourlyRate: 200,
    workHistory: [
      {
        jobTitle: "Frontend Developer",
      
        rating: 4.5,
        overView:
          "even though new to upwork the level of work carried out was excellent. would not hesitate to recommend them",
      },
    ],
  };

  return (
    <div className="flex">
      <aside className="w-1/4 p-5 border-r border-gray-200">
        <div className="flex items-center space-x-4 min-w-[60] ">
          <img
            src={userData?.profile?.location || "default-profile-pic.jpg"}
            alt={`${userData?.name}'s profile`}
            className="w-24 h-24 rounded-full"
          />

          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-700">
              {userData?.name || "User Name"}
            </h2>

            <p className="text-gray-500">{userData?.jobTitle || "Job Title"}</p>

            <p className="text-gray-500">
              {userData?.dateOfBirth
                ? calculateAge(userData.dateOfBirth)
                : "N/A"}{" "}
              Years
            </p>
          </div>
        </div>
        <hr className="my-8 border-gray-300" />
        <div className="flex items-center justify-center">
          <Rating layout={"userProfile"} reviews={reviews} />
        </div>
        <hr className="my-8 border-gray-300" />

      </aside>

      <main className="flex-grow p-5">
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-teal-600">Profile</h3>

          <div className="flex justify-between mt-5 font-semibold text-lg">
            <h1>{userData?.jobTitle || "Job Title"}</h1>
            <span>₹ {userData?.hourlyRate || "Hourly Rate"} /hr</span>
          </div>

          <p className="text-gray-600 mt-5 text-lg">
            {userData?.overview || "No profile information available."}
          </p>

          <div className="flex flex-wrap my-5">
            {userData?.skills?.map((skill, index) => (
              <span
                key={index}
                className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
              >
                {skill}
              </span>
            ))}
          </div>
          <hr className="my-8 border-gray-300" />
        </section>

        {/* Experience Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-teal-600">Experience</h3>
          <div className="flex flex-wrap my-5">
            {userData?.experiences?.length > 0 ? (
              userData.experiences.map((experience, index) => (
                <div
                  key={index}
                  className="w-full p-4 mb-4 bg-gray-100 rounded-md relative group"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {experience.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    <strong>Company:</strong> {experience.company}
                  </p>
                  <p className="text-sm  text-gray-500">
                    <strong>Duration:</strong> {experience.duration}
                  </p>
                  <p className="text-sm  text-gray-500">
                    <strong>Overview:</strong> {experience.overview}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 mt-2">
                No experience information available.
              </p>
            )}
          </div>
        </section>

        {/* Ratings Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-teal-600">Work History</h3>
          <div className="mt-4 ">
            {userDatas?.workHistory?.length > 0 ? (
              userDatas.workHistory.map((item, index) => (
                <div key={index} className="p-4 mb-4 rounded-md shadow-md min-h-[20vh]">
                  <h4 className="text-xl font-semibold text-teal-800">
                    {item.jobTitle || "Job Title"}
                  </h4>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          className={`w-5 h-5 ${
                            starIndex < (item.rating || 0)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l2.45 4.95L20 8.9l-3.5 3.41L17 18l-5-2.5L7 18l1.5-5.69L5 8.9l5.55-.95L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 ml-2">
                      {item.rating || "No rating"}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 text-gray-600">
                    "{item.overView || "No overview"}"
                  </div>
                  <div className="flex justify-start items-center mt-2 text-gray-600">
                  
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 mt-2">No work history available.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
