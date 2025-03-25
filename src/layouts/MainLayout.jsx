import React from "react";
import Navbar from "../components/Navbar/Navbar";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}

export default MainLayout;
