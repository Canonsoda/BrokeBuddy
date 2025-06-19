import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../Layout/DashboardLayout";
import { LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  const profilePic = user?.profilePic?.startsWith("http")
    ? user.profilePic
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=6b5448&color=fff&size=128`;
    

  return (
    <DashboardLayout>
      <div className="min-h-screen px-2 sm:px-4 lg:px-8 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">👤 Profile</h1>

        <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-4 sm:p-8 space-y-6 border border-[#e8dfd8]">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <img
              src={profilePic}
              alt="Profile"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-[#6b5448] shadow-lg object-cover"
            />
          </div>

          {/* User Details */}
          <div className="space-y-2 text-center">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Name</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">{user?.name || "Not available"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Email</p>
              <p className="text-base sm:text-lg font-medium text-gray-700">{user?.emailId || "Not available"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Role(s)</p>
              <p className="text-base sm:text-lg font-medium capitalize text-gray-700">
                {Array.isArray(user?.roles)
                  ? user.roles.join(", ")
                  : user?.role || "Not assigned"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition text-sm sm:text-base"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
