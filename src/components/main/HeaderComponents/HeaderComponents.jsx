import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../../utils/context/ProfileContext";

const DesktopNav = ({ userInfo }) => {
  const { userProfile } = useUserProfile();
  const isUserProfile = userInfo?.isUserProfile;
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { label: "Find Work", href: "/user/findWork" },
    { label: "My Work", href: "/user/workList" },
    { label: "Message", href: "/user/messages" },
  ];

  return (
    isUserProfile && (
      <div className="flex flex-row gap-4">
        {NAV_ITEMS.map((navItem) => (
          <div key={navItem.label}>
            <button
              onClick={() => navigate(navItem.href)}
              className="p-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-white transition-colors"
            >
              {navItem.label}
            </button>
          </div>
        ))}
      </div>
    )
  );
};

const DesktopNavClient = ({ userInfo }) => {
  const { clientProfile } = useUserProfile();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { label: "Find Talent", href: "/client/UserList" },
    { label: "My Jobs", href: "/client/joblisted" },
    { label: "Message", href: "/client/messages" },
    { label: "Bills", href: "/client/Bills" },
  ];

  return (
    clientProfile && (
      <div className="flex flex-row gap-4">
        {NAV_ITEMS.map((navItem) => (
          <div key={navItem.label}>
            <button
              onClick={() => navigate(navItem.href)}
              className="p-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-white transition-colors"
            >
              {navItem.label}
            </button>
          </div>
        ))}
      </div>
    )
  );
};

const MobileNav = ({ handleLogout, user, handleLogin, userInfo }) => {
  const NAV_ITEMS = userInfo?.job_role === "freelancer"
    ? [
        { label: "Find Work", href: "/userAuctions" },
        { label: "My Work", href: "/userSellers" },
        { label: "Message", href: "/userAuctioning" },
        { label: "Auction", href: "/userWatchlist" },
      ]
    : [
        { label: "Find Talent", href: "/userAuctions" },
        { label: "My Jobs", href: "/userSellers" },
        { label: "Message", href: "/userAuctioning" },
        { label: "Create Auction", href: "/userWatchlist" },
      ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 md:hidden border-t border-gray-100">
      {userInfo &&
        NAV_ITEMS.map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
      <div className="flex flex-col gap-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-white"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full text-left py-2 font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-white"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

const MobileNavItem = ({ label, href }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(href)}
        className="w-full text-left py-2 font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-white"
      >
        {label}
      </button>
    </div>
  );
};

export { DesktopNav, MobileNav, DesktopNavClient };
