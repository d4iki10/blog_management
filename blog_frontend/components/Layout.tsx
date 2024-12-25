import React from "react";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
        <Navbar />
        <main style={{ padding: "4rem" }}>{children}</main>
        </>
    );
};

export default Layout;
