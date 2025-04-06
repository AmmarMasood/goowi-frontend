import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, HomeFilled, ProfileFilled } from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { logout, userDetails } = useAuth();
  const location = useLocation(); // Get the current route

  return (
    <nav className="flex items-center justify-between bg-white px-4 shadow-md">
      <div className="text-xl font-bold text-dark-blue">Goowi</div>
      <div className="flex space-x-6">
        <Link
          to="/home"
          className={`${
            location.pathname === "/home"
              ? "border-b-2 border-darker-blue"
              : "text-dark-blue"
          } hover:text-darker-blue flex flex-col justify-center items-center h-[60px]`}
        >
          <HomeFilled className="text-md" />
          <span className="ml-1">Home</span>
        </Link>
        <Link
          to="/profile"
          className={`${
            location.pathname === "/profile"
              ? "border-b-2 border-darker-blue"
              : "text-dark-blue"
          } hover:text-darker-blue flex flex-col justify-center items-center h-[60px] ml-3`}
        >
          <ProfileFilled className="text-md" />
          <span className="ml-1">My Profile</span>
        </Link>
      </div>

      <div className="flex items-center cursor-pointer">
        <Dropdown
          menu={{
            items: [{ label: "Logout", onClick: logout }],
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <Avatar
              size={"small"}
              icon={<UserOutlined />}
              src={userDetails?.profilePicture}
            />
            <span className="text-dark-blue ml-2">
              {userDetails?.firstName} {userDetails?.lastName}
            </span>
          </div>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
