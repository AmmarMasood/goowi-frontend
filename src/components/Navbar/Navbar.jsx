import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Dropdown } from "antd";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="text-xl font-bold text-dark-blue">Goowi</div>
      <div className="flex space-x-4">
        <Link to="/home" className="text-dark-blue hover:text-darker-blue">
          Home
        </Link>
        <Link to="/profile" className="text-dark-blue hover:text-darker-blue">
          My Profile
        </Link>
      </div>
      <div className="flex items-center cursor-pointer">
        <Dropdown
          menu={{
            items: [{ label: "Logout", onClick: logout }],
          }}
        >
          <span className="text-dark-blue">John Doe</span>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
