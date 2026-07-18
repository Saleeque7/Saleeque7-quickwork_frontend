import { Link } from "react-router-dom";

export default function Logo({ userInfo }) {
  return (
    <div className="flex items-center">
      {userInfo?.job_role === "freelancer" ? (
        <Link to={'/user/home'}>
          <img src="/images/logo.png" className="h-8 w-auto object-contain" alt="Logo" />
        </Link>
      ) : userInfo?.job_role === "client" ? (
        <Link to={'/user/client'}>
          <img src="/images/logo.png" className="h-8 w-auto object-contain" alt="Logo" />
        </Link>
      ) : (
        <Link to={'/'}>
          <img src="/images/logo.png" className="h-8 w-auto object-contain" alt="Logo" />
        </Link>
      )}
    </div>
  );
}
