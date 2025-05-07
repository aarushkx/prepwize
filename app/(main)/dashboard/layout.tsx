import React from "react";
import Header from "./_components/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            <div className="mx-4 md:mx-20 lg:36">{children}</div>
        </div>
    );
};

export default DashboardLayout;
