import React from "react";
import { Outlet } from "react-router-dom";

import LeftNavBar from "../layout/LeftNavBar";
import TopNavbar from "../layout/TopNavbar";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <LeftNavBar />
            <TopNavbar /> 
            <Outlet /> 
        </div>
    );
};

export default MainLayout;
