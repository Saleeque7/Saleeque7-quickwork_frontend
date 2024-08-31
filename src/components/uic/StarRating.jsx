import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { userAxiosInstance ,clientAxiosInstance } from "../../utils/api/privateAxios";
import { recruiterRating , freelanceRating } from "../../utils/api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ReviewAndRating({ jobId ,layout , userId }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const getStarColor = (currentRating) => {
    return currentRating <= rating ? "text-yellow-500" : "text-gray-300";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      setError("Please provide both a rating and a comment.");
      return;
    }
    setError("");
    try {
      const data = {
        rating,
        comment,
        jobId,
      };

      const res = await userAxiosInstance.post(recruiterRating, data);
      if (res.data) {
        toast.success("success", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setRating(null);
        setComment("")
        setTimeout(() => {
            navigate("/user/home");
          }, 2000);
       
      }
    } catch (error) {
      console.error("error in rating client");
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      setError("Please provide both a rating and a comment.");
      return;
    }
    setError("");
    try {
      const data = {
        rating,
        comment,
        jobId,
        userId
      };

      const res = await clientAxiosInstance.post(freelanceRating, data);
      if (res.data) {
        toast.success("success", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setRating(null);
        setComment("")
        setTimeout(() => {
            navigate("/client/home");
          }, 2000);
       
      }
    } catch (error) {
      console.error("error in rating client");
    }
  };

 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Submit Your Review
        </h1>
        <div className="flex items-center mb-4 justify-center">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  className="hidden"
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                  checked={rating === currentRating}
                  readOnly
                />
                <FaStar
                  size={50}
                  className={`mr-1 ${getStarColor(currentRating)}`}
                />
              </label>
            );
          })}
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={layout === 'user' ? handleSubmit : handleClientSubmit} className="w-full">
          <textarea
            rows="4"
            placeholder="Leave your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-500 w-full"
            disabled={!comment}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
