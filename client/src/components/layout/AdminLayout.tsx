import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  // Now simply an Outlet wrapper, as AdminShell handles the sidebar/navbar per page
  return <Outlet />;
};

export default AdminLayout;
