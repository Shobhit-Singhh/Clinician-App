import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import LeftNavBar from "../layout/LeftNavBar";
import TopNavbar from "../layout/TopNavBar";

const MainLayout = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-full bg-neutral-50">
            <LeftNavBar
                isCollapsed={isNavCollapsed}
                onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
            />
            <TopNavbar
                isNavCollapsed={isNavCollapsed}
            />
            <main
                className={`
                    transition-all duration-300 
                    ${isNavCollapsed
                        ? 'ml-20' // When collapsed
                        : 'ml-64'  // When expanded
                    } 
                    mt-16
                `}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;