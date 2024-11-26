import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
        >
        ログアウト
        </button>
    );
};

export default Logout;
